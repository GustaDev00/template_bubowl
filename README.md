## Template Bubowl

Para facilitar a criação, foi moldado um template com Gulp para facilitar o desenvolvimento de sites

### Passo 1

para começar vamos instalar todas as dependencias do projeto

> npm i

### Passo 2

Dentro do arquivo gulpfile.js você vai trocar as informações da url do cliente e nome. Assim na hora de builda ja vai trocar em tudo.

### Ambiente de desenvolvimento

> npm run dev

HTML - Para criar uma página HTML, basta acessar "src > template > pages", só criar uma página seguindo o padrão.
Para facilitar a criação de arquivos HTML, vamos utilizar o pacote do gulp que vai unificar os arquivos. segue a doc de como usar: 
https://www.npmjs.com/package/gulp-file-include#user-content-examples

CSS - Vamos utilizar o SCSS e vai ser feito na basta scss dentro de src, para facilitar a manutenção, vamos criar pastas e nomear com o estili que ira conter 
ex: pasta header, com um arquivo index.scss e depois esse arquivo deve ser chamado no index na raiz do scss

JS - Para criar o script vamos criar dentro de src na pasta scrips, para facilitar a manutenção vamos criar pastas com o nume da função e 
exportar as funções e chamar no arquivo da raiz da pasta

### Passo 3 

> npm run build

Comando para buildar os arquivos já passando todas as urls para a url final do site e conseguirmos subir tudo redondo. Assim a gente não precisa trocar em todas as urls.

### Subindo o site

Para subir o site de forma facil iremos só pegar tudo que contem dentro da basta build e subir no servidor e já estara tudo certinho. 
(futuramente vincularemos a basta build com um git apart via ssh e subiremos direto assim que executarmos o npm run build (isso vai ser foda ne))
