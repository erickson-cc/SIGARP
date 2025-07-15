drop database sigarp;
create database sigarp;
\c sigarp;

CREATE TABLE IF NOT EXISTS unidade (
	codunid varchar(5) not null,
	nomeunid varchar(40) not null,
	cepunid varchar(9) not null,
	cidadeunid varchar (20) not null,
	bairrounid varchar(20) not null,
	numendrunid varchar(4) not null,
	logradourounid varchar(35) not null,
	telefoneunid varchar(10) not null,
	tipounid bit not null,
	emailunid text not null,
	representante varchar(5) not null,
	constraint pk_codunid primary key (codunid)
--	constraint fk_usr_resp foreign key (representante) references user_slc(codusrslc)

);

CREATE TABLE IF NOT EXISTS user_lct (
	codusrlic varchar(5) not null,
	nomeusrlic varchar(35) not null,
	constraint pk_codusrlic primary key (codusrlic)

);

CREATE TABLE IF NOT EXISTS user_slc (
	codusrslc varchar(5) not null,
	nomeusrslc varchar(35) not null,
	unidade_lota varchar(5) not null,
	constraint pk_codusrslc primary key (codusrslc),
	constraint fk_unidade_lota foreign key (unidade_lota) references unidade(codunid) -- Corrigir essa questão das duas tabelas apontarem uma para a outra

);
alter table unidade add constraint fk_usr_resp foreign key (representante) references user_slc(codusrslc); --  Para arrumar a dependência circular 

CREATE TABLE IF NOT EXISTS usuario (-- Usuário de acesso ao sistema
    id integer not null,
    nome_completo varchar(60) not null,
    funcao varchar(60) not null check (funcao in ('Administrador', 'Licitação', 'Solicitante')),
	codusrlct_user varchar(5) null, -- Vai apontar para um tipo de usuário dependendo da funcao
	codusrslc_user varchar(5) null,
    email varchar(255)  not null,
    senha text not null,
	constraint pk_usuario primary key (id),
	constraint uk_usuario unique (email),
	constraint fk_codusrlct_user foreign key (codusrlct_user) references user_lct(codusrlic),
	constraint codusrslc foreign key (codusrslc_user) references user_slc(codusrslc)

);
CREATE TABLE IF NOT EXISTS item (
	nuc varchar(12) not null,
	nomeitem text not null,
	constraint pk_item primary key (nuc)

);

CREATE TABLE IF NOT EXISTS licitacao (
	numerolic integer not null,
	anolic integer not null,
	descrlic varchar(60) not null,
	constraint pk_licitacao primary key (numerolic, anolic)

);

CREATE TABLE IF NOT EXISTS licitacao_item (
	item_a varchar(12) not null,
	licita_nro integer not null,
	licita_ano integer not null,
	constraint fk_item_a foreign key (item_a) references item(nuc),
	constraint fk_licita_i foreign key (licita_nro, licita_ano) references licitacao(numerolic, anolic)

);


CREATE TABLE IF NOT EXISTS ata_item (
	item_p varchar(12) not null,
	licita_nro integer not null,
	licita_ano integer not null,
	constraint fk_item_p foreign key (item_p) references item(nuc),
	constraint fk_licita_a foreign key (licita_nro, licita_ano) references licitacao(numerolic, anolic)

);


CREATE TABLE IF NOT EXISTS demanda (
	coddem varchar(5) not null,
	user_slc_d varchar(5) not null,
	constraint pk_coddem primary key (coddem),
	constraint fk_user_slc_d foreign key (user_slc_d) references user_slc(codusrslc)

);
CREATE TABLE IF NOT EXISTS demanda_item (
	quantidade_demanda integer not null,
	descricao_item_demanda text not null,
	item_ref varchar(12) not null,
	demanda_ref varchar(5) not null,
	constraint fk_item_d foreign key (item_ref) references item(nuc),
	constraint fk_demanda foreign key (demanda_ref) references demanda(coddem)

);

CREATE TABLE IF NOT EXISTS oficio_demanda (
	numdemofc integer not null,
	anodemofc integer not null,
	textdemofc text null, -- se null --> texto padrão
	demanda_ref varchar(5) not null,
	constraint pk_numdemofc primary key (numdemofc, anodemofc),
	constraint fk_demanda foreign key (demanda_ref) references demanda(coddem)


);
CREATE TABLE IF NOT EXISTS solicitacao (
	codsol varchar(5) not null,
	user_s varchar(5) not null,
	constraint fk_codsol primary key (codsol),
	constraint fk_user_s foreign key (user_s) references user_slc(codusrslc)

);

CREATE TABLE IF NOT EXISTS solicitacao_item (
	quantidade_solicitacao integer not null,
	item_sol_ref varchar(12) not null,
	solicitacao_ref varchar(5) not null,
	constraint fk_item_s foreign key (item_sol_ref) references item(nuc),
	constraint fk_solicitacao_ref foreign key (solicitacao_ref) references solicitacao(codsol)

);


CREATE TABLE IF NOT EXISTS oficio_solicitacao (
	numsolofc integer not null,
	anosolofc integer not null,
	textsolofc text null,
	solicitacao_ofc_ref varchar(5) not null,
	user_slc_ofc_ref varchar(5) not null,
	constraint pk_numsolofc primary key (numsolofc, anosolofc),
	constraint fk_solicitacao_ofc_ref foreign key (solicitacao_ofc_ref) references solicitacao(codsol),
	constraint fk_user_slc_s foreign key (user_slc_ofc_ref) references user_slc(codusrslc)

);

CREATE TABLE IF NOT EXISTS ata_rp (
	codarp varchar(5) not null,
	licitacao_nro_ref integer not null,
	licitacao_ano_ref integer not null,
	constraint pk_codarp primary key (codarp),
	constraint fk_licitacao_ref foreign key (licitacao_nro_ref, licitacao_ano_ref) references licitacao(numerolic, anolic)

);
CREATE TABLE IF NOT EXISTS pedido (
	codped varchar(5) not null,
	ata_ref varchar(5) not null,
	user_lct_ref varchar(5) not null,
	constraint pk_codped primary key (codped),
	constraint fk_ata_ref foreign key (ata_ref) references ata_rp(codarp),
	constraint fk_user_lct_ref foreign key (user_lct_ref) references user_lct(codusrlic)

);
CREATE TABLE IF NOT EXISTS oficio_pedido (
	numpedofc integer not null,
	anopedofc integer not null,
	textpedofc text null, -- Caso null -> texto padrão.
	pedido_ref varchar(5) not null,
	constraint pk_numpedofc primary key (numpedofc, anopedofc),
	constraint fk_pedido foreign key (pedido_ref) references pedido(codped)

);
CREATE TABLE IF NOT EXISTS pedido_item (
	quantidade_pedido integer not null,
	inclui_pedido varchar(5) not null,
	inclui_item varchar(12) not null,
	constraint fk_pedido foreign key (inclui_pedido) references pedido(codped),
	constraint fk_item_i foreign key (inclui_item) references item(nuc)
);
CREATE TABLE IF NOT EXISTS representante (
	cpfrepr varchar(14) not null,
	idrepr integer not null,
	nomerepr varchar(35) not null,
	constraint pk_cpfrepr primary key (cpfrepr)

);


CREATE TABLE IF NOT EXISTS fornecedor (
	cnpjforn varchar(18) not null,
	nomeforn varchar(35) not null,
	ufforn varchar(2) not null,
	cepforn varchar(9) not null, -- Pesquisar sobre o cep ser um integer
	cidadeforn varchar(20) not null,
	bairroforn varchar(20) not null,
	numendrforn varchar(4) not null,
	logradouroforn varchar(35) not null,
	representante_ref varchar(14) not null,
	constraint pk_cnpjforn primary key (cnpjforn),
	constraint fk_representante foreign key (representante_ref) references representante(cpfrepr)

);

CREATE TABLE IF NOT EXISTS fornece_item (
	numeroitem integer not null,
	valorunitario money not null,
	quantidadeitem integer not null,
	descricaoitem text null,
	item_f_ref varchar(12) not null,
	fornecedor_f_ref varchar(18) not null,
	constraint fk_item_f foreign key (item_f_ref) references item(nuc),
	constraint fk_fornecedor_f foreign key (fornecedor_f_ref) references fornecedor(cnpjforn)

);

--INSERT INTO usuario (id, nome_completo, funcao, codusrlct_user, codusrslc_user, email, senha) values (1, 'Admin', 'Administrador', null, null, 'admin@admin.com', '$2a$12$jdGM7XVeDa3ijOAP4a0BiOGEjTmj79mRDihdOVtk2wScQZmb44YUK');--Senha admin
