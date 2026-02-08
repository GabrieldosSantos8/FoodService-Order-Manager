
using Microsoft.EntityFrameworkCore;
using PizzariaApi.Models; 
namespace PizzariaApi.Data;

public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Pizza> Pizzas { get; set; }
    public DbSet<Endereco> Enderecos { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<ItemPedido> ItensPedido { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração de relacionamentos
        modelBuilder.Entity<Endereco>()
            .HasOne(e => e.Usuario)
            .WithMany()
            .HasForeignKey(e => e.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Pedido>()
            .HasOne(p => p.Usuario)
            .WithMany()
            .HasForeignKey(p => p.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Pedido>()
            .HasOne(p => p.EnderecoEntrega)
            .WithMany()
            .HasForeignKey(p => p.EnderecoEntregaId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<ItemPedido>()
            .HasOne(ip => ip.Pedido)
            .WithMany(p => p.Itens)
            .HasForeignKey(ip => ip.PedidoId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ItemPedido>()
            .HasOne(ip => ip.Pizza)
            .WithMany()
            .HasForeignKey(ip => ip.PizzaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}