import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTriggers() {
  try {
    console.log('🔍 Testando triggers e RLS...');
    
    // 1. Testar se conseguimos inserir um profile com userId válido
    console.log('\n📝 Testando inserção de profile...');
    
    try {
      const testProfile = await prisma.profile.create({
        data: {
          userId: 'auth-user-test',
          email: 'teste@exemplo.com',
          name: 'Usuário Teste',
          accountType: 'USER'
        }
      });
      console.log('✅ Profile criado com sucesso:', testProfile.id);
      
      // Limpar o teste
      await prisma.profile.delete({
        where: { id: testProfile.id }
      });
      console.log('🧹 Profile de teste removido');
      
    } catch (error) {
      console.log('❌ Erro ao criar profile:', error);
    }
    
    // 2. Testar se conseguimos inserir um profile com email duplicado
    console.log('\n📧 Testando validação de email duplicado...');
    
    try {
      const duplicateProfile = await prisma.profile.create({
        data: {
          userId: 'auth-user-duplicate',
          email: 'joao.silva@email.com', // Email já existe
          name: 'Usuário Duplicado',
          accountType: 'USER'
        }
      });
      console.log('❌ Profile duplicado foi criado (não deveria)');
      
    } catch (error) {
      console.log('✅ Validação de email funcionando:', error);
    }
    
    // 3. Testar relacionamentos
    console.log('\n🔗 Testando relacionamentos...');
    
    const profileWithData = await prisma.profile.findFirst({
      include: {
        listings: {
          include: {
            book: true,
            location: true
          }
        },
        favorites: true,
        friends: {
          include: {
            friend: true
          }
        }
      }
    });
    
    if (profileWithData) {
      console.log(`✅ Perfil "${profileWithData.name}" tem:`);
      console.log(`   • ${profileWithData.listings.length} listagens`);
      
      if (profileWithData.listings.length > 0) {
        const listing = profileWithData.listings[0];
        console.log(`   • Listagem: "${listing.book?.title}" em ${listing.location?.name}`);
      }
      
      console.log(`   • ${profileWithData.favorites.length} favoritos`);
      console.log(`   • ${profileWithData.friends.length} amigos`);
    }
    
    // 4. Testar consultas complexas
    console.log('\n🔍 Testando consultas complexas...');
    
    const listingsWithDetails = await prisma.listing.findMany({
      include: {
        profile: true,
        book: true,
        location: true,
        category: true
      }
    });
    
    console.log(`✅ Encontradas ${listingsWithDetails.length} listagens com detalhes:`);
    listingsWithDetails.forEach((listing: any) => {
      console.log(`   • ${listing.book?.title} por ${listing.profile?.name} em ${listing.location?.name}`);
    });
    
    console.log('\n🎉 Teste de triggers e RLS concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTriggers();
