from flask_sqlalchemy import SQLAlchemy

# Instância do SQLAlchemy para gerenciar o banco de dados
db = SQLAlchemy()

# Modelo para a tabela 'products' que armazena informações sobre produtos
class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)  # ID único de cada produto
    name = db.Column(db.String(255), nullable=False)  # Nome do produto
    registration_number = db.Column(db.String(50), unique=True, nullable=False)  # Número de registro único
    manufacturer = db.Column(db.String(255))  # Fabricante do produto
    type = db.Column(db.String(50))  # Tipo do produto
    description = db.Column(db.Text)  # Descrição detalhada do produto

# Modelo para a tabela 'entries' que armazena as entradas de estoque de cada produto
class Entry(db.Model):
    __tablename__ = 'entries'
    id = db.Column(db.Integer, primary_key=True)  # ID único de cada entrada
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)  # ID do produto relacionado
    quantity = db.Column(db.Integer, nullable=False)  # Quantidade de produtos entrando no estoque
    date_time = db.Column(db.DateTime)  # Data e hora da entrada
    location = db.Column(db.String(255))  # Local da entrada

# Modelo para a tabela 'exits' que armazena as saídas de estoque de cada produto
class Exit(db.Model):
    __tablename__ = 'exits'
    id = db.Column(db.Integer, primary_key=True)  # ID único de cada saída
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)  # ID do produto relacionado
    quantity = db.Column(db.Integer, nullable=False)  # Quantidade de produtos saindo do estoque
    date_time = db.Column(db.DateTime)  # Data e hora da saída
    location = db.Column(db.String(255))  # Local da saída
