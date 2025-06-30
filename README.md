# SIGARP - Sistema de Gerenciamento de Atas de Registro de Preços
Autores: [Aysha Thayna](https://github.com/Ayshathayna) (Mat: 20230002943), [Erickson Muller](https://github.com/erickson-cc) (Mat: 20230001178) e [Thais Zanella](https://github.com/thaiszanella) (Mat: 20230000958)

## Descrição

Este repositório refere-se ao **Trabalho Integrador** das disciplinas de **Programação II**, **Banco de Dados** e **Engenharia de Software** do curso de **Ciência da Computação**. O objetivo do projeto é desenvolver uma **aplicação web** completa, aplicando os conceitos das 3 disciplinas

## Arquitetura de Software

O código do sistema está estruturado da seguinte forma:

- ./src/
- docs/ *Documentação do projeto*
    - diagramas/
        - **Modelo Conceitual construído na ferramenta brModelo (https://app.brmodeloweb.com/#!/publicview/6849d5d55f7c40653b62241e)**
        - **Modelo Lógico construído na ferramenta dbDiagram (https://dbdiagram.io/d/6861e767f413ba35086db0d1)**
        - **Modelo Lógico em formato de código adaptado para a ferramenta dbDiagram**
    - glossario/
        - **Glossário.pdf**
    - requisitos/
        - **Documento de Elicitação de Requistitos**
- ./src/
  - backend/ *Código backend*
  - frontend/ *Código frontend*
    - css/ *Código em CSS*
    - html/ *Código em HTML*
    - img/ *Repositório de Imagens*
    - js/ *Código em JavaScript*
  - database/ *Modelo Físico do Banco de Dados*
    - dbSIGARP.sql
  - README.md *Descrição Repositório Github* 



### docs/
Esta pasta é dedicada à documentação abrangente do projeto SIGARP. Abriga os documentos de histórico, planejamento e estruturação do projet. Isso pode incluir diagramas de modelagem de dados, guias de implantação, manuais de usuário e quaisquer outros documentos relevantes que ajudem o grupo, avaliadores e futuros usuários a compreender o funcionamento interno e externo da aplicação.

### backend/
A pasta _backend_ contém toda a lógica de negócios e a implementação do lado do servidor da aplicação. Aqui residem os códigos responsáveis pelo gerenciamento dos dados, pela comunicação com o banco de dados, pela definição das APIs que o frontend consome e por toda a inteligência por trás da aplicação web.

### frontend/
A pasta _frontend_ abriga todos os arquivos relacionados à interface do usuário (UI) e à experiência do usuário (UX) do sistema SIGARP. Abriga os códigos HTML que estruturam as páginas web, os estilos em CSS que definem a apresentação visual, os scripts em JavaScript que adicionam interatividade e dinamismo, e quaisquer assets como imagens e fontes utilizadas na interface. A organização interna desta pasta, como as subpastas _css_, _html_, _img_ e _js_ que você já definiu, visa manter o código do lado do cliente bem estruturado e fácil de manter, proporcionando uma experiência de uso fluida e intuitiva para os usuários do sistema.
