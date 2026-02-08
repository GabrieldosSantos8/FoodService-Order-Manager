using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PizzariaApi.Data;
using PizzariaApi.Models;

namespace PizzariaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PizzaController : ControllerBase
{
    private readonly AppDbContext _context;

    public PizzaController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/pizza - Listar todas as pizzas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pizza>>> GetPizzas()
    {
        return await _context.Pizzas.Where(p => p.Ativo).ToListAsync();
    }

    // GET: api/pizza/5 - Obter pizza por ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Pizza>> GetPizza(int id)
    {
        var pizza = await _context.Pizzas.FindAsync(id);

        if (pizza == null)
        {
            return NotFound();
        }

        return pizza;
    }

    // GET: api/pizza/categoria/Salgada - Obter pizzas por categoria
    [HttpGet("categoria/{categoria}")]
    public async Task<ActionResult<IEnumerable<Pizza>>> GetPizzasPorCategoria(string categoria)
    {
        return await _context.Pizzas
            .Where(p => p.Categoria == categoria && p.Ativo)
            .ToListAsync();
    }

    // POST: api/pizza - Criar nova pizza (apenas admin)
    [HttpPost]
    public async Task<ActionResult<Pizza>> CreatePizza(Pizza pizza)
    {
        _context.Pizzas.Add(pizza);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPizza", new { id = pizza.Id }, pizza);
    }

    // PUT: api/pizza/5 - Atualizar pizza
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePizza(int id, Pizza pizza)
    {
        if (id != pizza.Id)
        {
            return BadRequest();
        }

        _context.Entry(pizza).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PizzaExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/pizza/5 - Deletar pizza (soft delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePizza(int id)
    {
        var pizza = await _context.Pizzas.FindAsync(id);
        if (pizza == null)
        {
            return NotFound();
        }

        pizza.Ativo = false; // Soft delete
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PizzaExists(int id)
    {
        return _context.Pizzas.Any(e => e.Id == id);
    }
}
