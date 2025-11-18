import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco...');
    
    // 1. Verificar se conseguimos conectar
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // 2. Verificar se a tabela profiles existe e tem dados
    console.log('\n📊 Verificando tabela profiles...');
    const profiles = await prisma.profile.findMany();
    console.log(`✅ Encontrados ${profiles.length} perfis:`);
    profiles.forEach((profile: any) => {
      console.log(`   • ${profile.name} (${profile.email}) - ID: ${profile.id}, UserID: ${profile.userId}`);
    });
    
    // 3. Verificar se conseguimos acessar outras tabelas
    console.log('\n📚 Verificando outras tabelas...');
    
    const categories = await prisma.category.findMany();
    console.log(`✅ Categorias: ${categories.length}`);
    
    const books = await prisma.book.findMany();
    console.log(`✅ Livros: ${books.length}`);
    
    const listings = await prisma.listing.findMany();
    console.log(`✅ Listagens: ${listings.length}`);
    
    // 4. Testar uma consulta com relacionamento
    console.log('\n🔗 Testando relacionamentos...');
    const profileWithListings = await prisma.profile.findFirst({
      include: {
        listings: true,
        favorites: true,
        friends: true
      }
    });
    
    if (profileWithListings) {
      console.log(`✅ Perfil "${profileWithListings.name}" tem:`);
      console.log(`   • ${profileWithListings.listings.length} listagens`);
      console.log(`   • ${profileWithListings.favorites.length} favoritos`);
      console.log(`   • ${profileWithListings.friends.length} amigos`);
    }
    
    console.log('\n🎉 Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
