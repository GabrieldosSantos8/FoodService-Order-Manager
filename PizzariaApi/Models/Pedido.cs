namespace PizzariaApi.Models;

public class Pedido
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public DateTime DataPedido { get; set; } = DateTime.UtcNow;
    public decimal Total { get; set; }
    public string Status { get; set; } = "Pendente"; // Pendente, Confirmado, Em Preparo, Saiu para Entrega, Entregue, Cancelado
    public string Observacoes { get; set; } = string.Empty;
    public int? EnderecoEntregaId { get; set; }

    // Relacionamentos
    public Usuario? Usuario { get; set; }
    public Endereco? EnderecoEntrega { get; set; }
    public ICollection<ItemPedido> Itens { get; set; } = new List<ItemPedido>();
}
