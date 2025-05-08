-- init.sql

-- Tabela de usuários
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
