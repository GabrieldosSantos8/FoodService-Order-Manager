using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PizzariaApi.Models;
using PizzariaApi.Data;

namespace PizzariaApi.Controllers;
[ApiController]
[Route("api/[controller]")] // Isso faz a rota ser api/usuario
public class UsuarioController : ControllerBase 
{
    private readonly AppDbContext _context;

    public UsuarioController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
    {
        return await _context.Usuarios.ToListAsync();
    }

    public class CadastroRequest {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
    }

    public class LoginRequest {
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }

    [HttpPost("cadastro")]
    public async Task<IActionResult> Cadastro([FromBody] CadastroRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Senha) || string.IsNullOrWhiteSpace(req.Nome))
        {
            return BadRequest(new { message = "Nome, email e senha são obrigatórios." });
        }

        var exists = await _context.Usuarios.AnyAsync(u => u.Email == req.Email);
        if (exists)
        {
            return Conflict(new { message = "Já existe um usuário com esse e-mail." });
        }

        var usuario = new Usuario {
            Nome = req.Nome,
            Email = req.Email,
            Senha = req.Senha,
            Telefone = req.Telefone
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        // retornar token simples (GUID) e usuário sem senha
        var token = System.Guid.NewGuid().ToString();
        var usuarioResp = new {
            id = usuario.Id,
            nome = usuario.Nome,
            email = usuario.Email,
            telefone = usuario.Telefone
        };

        return CreatedAtAction(nameof(GetUsuarios), new { id = usuario.Id }, new { token, usuario = usuarioResp });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Senha))
        {
            return BadRequest(new { message = "Email e senha são obrigatórios." });
        }

        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == req.Email && u.Senha == req.Senha);
        if (usuario == null)
        {
            return Unauthorized(new { message = "Credenciais inválidas." });
        }

        var token = System.Guid.NewGuid().ToString();
        var usuarioResp = new {
            id = usuario.Id,
            nome = usuario.Nome,
            email = usuario.Email,
            telefone = usuario.Telefone
        };

        return Ok(new { token, usuario = usuarioResp });
    }
}