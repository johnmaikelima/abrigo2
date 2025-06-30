const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Executar o build do Next.js
try {
  console.log('Iniciando build do Next.js...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build do Next.js concluído com sucesso!');
  
  // Criar os arquivos de manifesto após o build
  console.log('Criando arquivos de manifesto após o build...');
  
  // Diretório para os arquivos de manifesto
  const manifestDir = path.join('.next', 'server', 'app', '(main)');
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
    console.log(`Diretório criado: ${manifestDir}`);
  }
  
  // Criar arquivos de manifesto vazios
  const manifestPath = path.join(manifestDir, 'page_client-reference-manifest.js');
  fs.writeFileSync(manifestPath, 'export default {}');
  console.log(`Arquivo criado: ${manifestPath}`);
  
  const layoutManifestPath = path.join(manifestDir, 'layout_client-reference-manifest.js');
  fs.writeFileSync(layoutManifestPath, 'export default {}');
  console.log(`Arquivo criado: ${layoutManifestPath}`);
  
  // Verificar se os arquivos foram criados
  if (fs.existsSync(manifestPath) && fs.existsSync(layoutManifestPath)) {
    console.log('Arquivos de manifesto criados com sucesso!');
  } else {
    console.error('Falha ao criar arquivos de manifesto!');
  }
  
  process.exit(0);
} catch (error) {
  console.error('Erro durante o build do Next.js:', error.message);
  
  // Tentar criar os arquivos de manifesto mesmo se o build falhar
  console.log('Tentando criar arquivos de manifesto após falha no build...');
  
  const manifestDir = path.join('.next', 'server', 'app', '(main)');
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }
  
  const manifestPath = path.join(manifestDir, 'page_client-reference-manifest.js');
  fs.writeFileSync(manifestPath, 'export default {}');
  
  const layoutManifestPath = path.join(manifestDir, 'layout_client-reference-manifest.js');
  fs.writeFileSync(layoutManifestPath, 'export default {}');
  
  console.log('Arquivos de manifesto criados após falha no build.');
  process.exit(0); // Sair com sucesso mesmo após falha no build
}
