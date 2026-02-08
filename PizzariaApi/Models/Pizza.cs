namespace PizzariaApi.Models;

public class Pizza
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string Categoria { get; set; } = string.Empty; // Ex: "Doce", "Salgada", "Especial"
    public string Imagem { get; set; } = string.Empty; // URL da imagem
    public bool Ativo { get; set; } = true;
}
