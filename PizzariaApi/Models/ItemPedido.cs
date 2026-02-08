namespace PizzariaApi.Models;

public class ItemPedido
{
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public int PizzaId { get; set; }
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
    public decimal Total => Quantidade * PrecoUnitario;

    // Relacionamentos
    public Pedido? Pedido { get; set; }
    public Pizza? Pizza { get; set; }
}
