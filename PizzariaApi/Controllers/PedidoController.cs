using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PizzariaApi.Data;
using PizzariaApi.Models;

namespace PizzariaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidoController : ControllerBase
{
    private readonly AppDbContext _context;

    public PedidoController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/pedido - Listar pedidos do usuário
    [HttpGet("usuario/{usuarioId}")]
    public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidosUsuario(int usuarioId)
    {
        return await _context.Pedidos
            .Where(p => p.UsuarioId == usuarioId)
            .Include(p => p.Itens)
            .ThenInclude(ip => ip.Pizza)
            .OrderByDescending(p => p.DataPedido)
            .ToListAsync();
    }

    // GET: api/pedido/5 - Obter pedido por ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Pedido>> GetPedido(int id)
    {
        var pedido = await _context.Pedidos
            .Include(p => p.Itens)
            .ThenInclude(ip => ip.Pizza)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pedido == null)
        {
            return NotFound();
        }

        return pedido;
    }

    // POST: api/pedido - Criar novo pedido
    [HttpPost]
    public async Task<ActionResult<Pedido>> CreatePedido(PedidoCreateRequest request)
    {
        var pedido = new Pedido
        {
            UsuarioId = request.UsuarioId,
            EnderecoEntregaId = request.EnderecoEntregaId,
            Observacoes = request.Observacoes,
            Status = "Pendente"
        };

        // Adicionar itens do pedido e calcular total
        decimal total = 0;
        foreach (var item in request.Itens)
        {
            var pizza = await _context.Pizzas.FindAsync(item.PizzaId);
            if (pizza == null)
            {
                return BadRequest($"Pizza com ID {item.PizzaId} não encontrada");
            }

            var itemPedido = new ItemPedido
            {
                PizzaId = item.PizzaId,
                Quantidade = item.Quantidade,
                PrecoUnitario = pizza.Preco
            };

            pedido.Itens.Add(itemPedido);
            total += itemPedido.Total;
        }

        pedido.Total = total;
        _context.Pedidos.Add(pedido);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPedido", new { id = pedido.Id }, pedido);
    }

    // PUT: api/pedido/5/status - Atualizar status do pedido
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatusPedido(int id, [FromBody] StatusUpdate statusUpdate)
    {
        var pedido = await _context.Pedidos.FindAsync(id);

        if (pedido == null)
        {
            return NotFound();
        }

        pedido.Status = statusUpdate.NovoStatus;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/pedido/5 - Atualizar pedido
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePedido(int id, Pedido pedido)
    {
        if (id != pedido.Id)
        {
            return BadRequest();
        }

        _context.Entry(pedido).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PedidoExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/pedido/5 - Cancelar pedido
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePedido(int id)
    {
        var pedido = await _context.Pedidos.FindAsync(id);
        if (pedido == null)
        {
            return NotFound();
        }

        // Apenas pedidos pendentes podem ser cancelados
        if (pedido.Status != "Pendente")
        {
            return BadRequest("Apenas pedidos pendentes podem ser cancelados");
        }

        pedido.Status = "Cancelado";
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PedidoExists(int id)
    {
        return _context.Pedidos.Any(e => e.Id == id);
    }
}

// DTOs para requisições
public class PedidoCreateRequest
{
    public int UsuarioId { get; set; }
    public int? EnderecoEntregaId { get; set; }
    public string Observacoes { get; set; } = string.Empty;
    public List<ItemPedidoRequest> Itens { get; set; } = new();
}

public class ItemPedidoRequest
{
    public int PizzaId { get; set; }
    public int Quantidade { get; set; }
}

public class StatusUpdate
{
    public string NovoStatus { get; set; } = string.Empty;
}
