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


# Modelo para a tabela 'locations' que guarda as informações sobre os locais de armazenamento
class Location(db.Model):
    __tablename__ = 'locations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)  # Nome do local
    description = db.Column(db.Text)  # Descrição do local

# Modelo para a tabela 'entries' que armazena as entradas de estoque de cada produto
class Entry(db.Model):
    __tablename__ = 'entries'
    id = db.Column(db.Integer, primary_key=True)  # ID único de cada entrada
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)  # ID do produto relacionado
    product = db.relationship("Product", lazy="select") # Definindo o relacionamento para o select
    quantity = db.Column(db.Integer, nullable=False)  # Quantidade de produtos entrando no estoque
    date_time = db.Column(db.DateTime)  # Data e hora da entrada
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)  # ID do local relacionado
    location = db.relationship("Location", lazy="select") # Definindo o relacionamento para o select

# Modelo para a tabela 'exits' que armazena as saídas de estoque de cada produto
class Exit(db.Model):
    __tablename__ = 'exits'
    id = db.Column(db.Integer, primary_key=True)  # ID único de cada saída
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)  # ID do produto relacionado
    product = db.relationship("Product", lazy="select") # Definindo o relacionamento para o select
    quantity = db.Column(db.Integer, nullable=False)  # Quantidade de produtos saindo do estoque
    date_time = db.Column(db.DateTime)  # Data e hora da saída
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)  # ID do local relacionado
    location = db.relationship("Location", lazy="select") # Definindo o relacionamento para o select

# Modelo para a tabela 'stock_balances' que armazena os saldos de cada local de armazenamento por produto 
class StockBalance(db.Model):
    __tablename__ = 'stock_balances'
    id = db.Column(db.Integer, primary_key=True) # ID único de cada saldo
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False) # ID do produto relacionado
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False) # ID do local relacionado
    balance = db.Column(db.Integer, nullable=False, default=0) # Saldo

    # Definir restrição de unicidade para garantir que cada produto tenha um único saldo por local
    __table_args__ = (
        db.UniqueConstraint('product_id', 'location_id', name='unique_product_location'),
    )
    
    product = db.relationship("Product", backref="stock_balances")
    location = db.relationship("Location", backref="stock_balances")
