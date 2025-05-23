-- init.sql

drop table if EXISTS tarefas;
drop table if EXISTS categorias;
drop table if EXISTS dias;
drop table if EXISTS frases;
drop table if EXISTS usuarios;

-- Tabela de usuário
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
);

-- Tabela de categorias
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL
);

-- Tabela de tarefas
CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  concluida BOOLEAN DEFAULT FALSE,
  data DATE NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE SET NULL
);

-- Tabela de frases motivacionais
CREATE TABLE frases (
  id SERIAL PRIMARY KEY,
  texto TEXT NOT NULL,
  faixa_xp_min INTEGER NOT NULL,
  faixa_xp_max INTEGER NOT NULL
);

-- Tabela de resumo diário
CREATE TABLE dias (
  id SERIAL PRIMARY KEY,
  data DATE NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  xp NUMERIC(5,2) NOT NULL, 
  frase_id INTEGER REFERENCES frases(id),
  CONSTRAINT dia_unico_por_usuario UNIQUE (data, usuario_id)
);

INSERT INTO frases (texto, faixa_xp_min, faixa_xp_max) VALUES
('Todo começo é difícil, mas você deu o primeiro passo!', 0, 40),
('Não se cobre demais, amanhã é uma nova chance.', 0, 40),
('Pequenos avanços ainda são avanços!', 0, 40),
('A constância é mais importante que a velocidade.', 0, 40),
('Respire fundo. Você ainda está no jogo.', 0, 40);

INSERT INTO frases (texto, faixa_xp_min, faixa_xp_max) VALUES
('Bom trabalho! Você está no caminho certo.', 41, 80),
('Mais um dia produtivo, continue assim!', 41, 80),
('Seu esforço está rendendo resultados.', 41, 80),
('Você está construindo um hábito poderoso.', 41, 80),
('Parabéns por manter o ritmo!', 41, 80);

INSERT INTO frases (texto, faixa_xp_min, faixa_xp_max) VALUES
('Excelente! Seu dia foi extremamente produtivo!', 81, 100),
('Você mandou muito bem hoje, continue nessa pegada!', 81, 100),
('Sua dedicação está fazendo a diferença.', 81, 100),
('Produtividade em alta! Orgulho define.', 81, 100),
('Dia concluído com sucesso! Você merece comemorar.', 81, 100);

INSERT INTO usuarios (nome, email, senha) values
(1, 'Enzo', 'enzocerutti123@gmail.com', '123456');

INSERT INTO categorias (nome) VALUES
(1, 'Estudos');

INSERT INTO tarefas (titulo, concluida, data, usuario_id, categoria_id) VALUES
('Estudar matemática', false, '2024-05-23', 1, 1);