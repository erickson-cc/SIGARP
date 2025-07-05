drop database sigarp;
create database sigarp;
\c sigarp;

CREATE TABLE IF NOT EXISTS item (
	nuc varchar(12) not null,
	nomeitem varchar not null,
	constraint pk_item primary key (nuc)

);

CREATE TABLE IF NOT EXISTS licitacao (
	numerolic integer not null,
	anolic integer not null,
	descrlic varchar(60) not null
	constraint pk_licitacao primary key (numerolic, anolic)

);

CREATE TABLE IF NOT EXISTS aquisicao (
	item_a varchar(12) not null,
	licita_nro integer not null,
	licita_ano integer not null,
	constraint fk_item_a foreign key (item_a) references item(nuc),
	constraint fk_licita_nro foreign key (licita_nro) references licitacao(numerolic),
	constraint fk_licita_ano foreign key (licita_ano) references licitacao(anolic)

);


CREATE TABLE IF NOT EXISTS pertence (
	item_p varchar(12) not null,
	licita_nro integer not null,
	licita_ano integer not null,
	constraint fk_item_p foreign key (item_p) references item.nuc,
	constraint fk_licita_nro foreign key (licita_nro) references licitacao(numerolic),
	constraint fk_licita_ano foreign key (licita_ano) references licitacao(anolic)

);

CREATE TABLE IF NOT EXISTS inclui (
	quantidade_pedido integer not null,
	inclui_pedido varchar(5) not null,
	inclui_item varchar(12) not null,
	constraint fk_pedido foreign key (inclui_pedido) references pedido(codped),
	constraint fk_item_i foreign key (inclui_item) references item(nuc)
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
	textpedofc text null -- Estudar se o valor null ocupa espaço no banco, pensar em guardar os ofícios em arquivos em vez de armazenar o texto no banco, é NULL pois o sis

);

CREATE TABLE IF NOT EXISTS demanda (
	coddem varchar(5) not null

);

CREATE TABLE IF NOT EXISTS oficio_demanda (
	numdemofc integer not null,
	anodemofc integer not null,
	textdemofc varchar(150) null

);

CREATE TABLE IF NOT EXISTS solicitacao (
	codsol varchar(5) not null

);

CREATE TABLE IF NOT EXISTS oficio_solicitacao (
	numsolofc integer not null,
	anosolofc integer not null,
	textsolofc varchar(150) null

);

CREATE TABLE IF NOT EXISTS ata_rp (
	codarp varchar(5) not null

);

CREATE TABLE IF NOT EXISTS fornecedor (
	cnpjforn varchar(18) not null,
	nomeforn varchar(35) not null,
	ufforn varchar(2) not null,
	cepforn varchar(9) not null, -- Pesquisar sobre o cep ser um integer
	cidadeforn varchar(20) not null,
	bairroforn varchar(20) not null,
	numendrforn varchar(4) not null,
	logradouroforn varchar(35) not null

);

CREATE TABLE IF NOT EXISTS representante (
	cpfrepr varchar(14) not null,
	idrepr integer not null,
	nome varchar(35) not null

);

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
	emailunid text not null

);


CREATE TABLE IF NOT EXISTS user_lct (
	codusrlic varchar(5) not null,
	nomeusrlic varchar(35)) not null

);

CREATE TABLE IF NOT EXISTS user_slc (
	codusrslc varchar(5) not null,
	nomeusrslc varchar(35)) not null

);
