using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PizzariaApi.Data;
using PizzariaApi.Models;

namespace PizzariaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnderecoController : ControllerBase
{
    private readonly AppDbContext _context;

    public EnderecoController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/endereco - Listar todos os endereços do usuário autenticado
    [HttpGet("usuario/{usuarioId}")]
    public async Task<ActionResult<IEnumerable<Endereco>>> GetEnderecosUsuario(int usuarioId)
    {
        return await _context.Enderecos
            .Where(e => e.UsuarioId == usuarioId)
            .ToListAsync();
    }

    // GET: api/endereco/5 - Obter endereço por ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Endereco>> GetEndereco(int id)
    {
        var endereco = await _context.Enderecos.FindAsync(id);

        if (endereco == null)
        {
            return NotFound();
        }

        return endereco;
    }

    // POST: api/endereco - Criar novo endereço
    [HttpPost]
    public async Task<ActionResult<Endereco>> CreateEndereco(Endereco endereco)
    {
        _context.Enderecos.Add(endereco);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetEndereco", new { id = endereco.Id }, endereco);
    }

    // PUT: api/endereco/5 - Atualizar endereço
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEndereco(int id, Endereco endereco)
    {
        if (id != endereco.Id)
        {
            return BadRequest();
        }

        _context.Entry(endereco).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EnderecoExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/endereco/5 - Deletar endereço
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEndereco(int id)
    {
        var endereco = await _context.Enderecos.FindAsync(id);
        if (endereco == null)
        {
            return NotFound();
        }

        _context.Enderecos.Remove(endereco);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool EnderecoExists(int id)
    {
        return _context.Enderecos.Any(e => e.Id == id);
    }
}
