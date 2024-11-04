import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from config import Config
from models import StockBalance, db, Product, Entry, Exit,Location
from utils.pdf_gen import generate_management_report
from utils.util_functions import movements


app = Flask(__name__)
app.config.from_object(Config)  # Carrega as configurações do banco de dados
db.init_app(app)  # Inicializa o SQLAlchemy com a configuração do app
CORS(app) #Lida com o Cross-origin Resource Sharing  

# Contexto de inicialização do banco de dados
with app.app_context():
    db.create_all()

# CREATE - Criar Produto
@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    new_product = Product(
        name=data['name'],
        registration_number=data['registration_number'],
        manufacturer=data['manufacturer'],
        type=data['type'],
        description=data['description']
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Produto adicionado com sucesso"}), 201

# READ - Obter um único Produto pelo ID
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        "id": product.id,
        "name": product.name,
        "registration_number": product.registration_number,
        "manufacturer": product.manufacturer,
        "type": product.type,
        "description": product.description
    }), 200

# UPDATE - Atualizar um Produto pelo ID
@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.json

    product.name = data.get('name', product.name)
    product.registration_number = data.get('registration_number', product.registration_number)
    product.manufacturer = data.get('manufacturer', product.manufacturer)
    product.type = data.get('type', product.type)
    product.description = data.get('description', product.description)

    db.session.commit()
    return jsonify({"message": "Produto atualizado com sucesso"}), 200

# DELETE - Remover um Produto pelo ID
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Produto excluído com sucesso"}), 200

# LIST - Obter lista de Produtos
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    product_list = [
        {
            "id": product.id,
            "name": product.name,
            "registration_number": product.registration_number,
            "manufacturer": product.manufacturer,
            "type": product.type,
            "description": product.description
        } for product in products
    ]
    return jsonify(product_list), 200

# CREATE - Criar Entrada de Produto
@app.route('/api/entries', methods=['POST'])
def add_entry():
    data = request.json
    new_entry = Entry(
        product_id=data['product_id'],
        quantity=int(data['quantity']),
        date_time=datetime.datetime.strptime(data['date_time'], '%Y-%m-%d %H:%M:%S'),
        location_id=data['location_id']
    )

    # Atualiza ou cria o saldo em StockBalance
    stock_balance = StockBalance.query.filter_by(product_id=new_entry.product_id, location_id=new_entry.location_id).first()
    if stock_balance:
        stock_balance.balance += new_entry.quantity
    else:
        new_stock_balance = StockBalance(product_id=new_entry.product_id, location_id=new_entry.location_id, balance=new_entry.quantity)
        db.session.add(new_stock_balance)
    
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"message": "Entrada registrada com sucesso"}), 201

# CREATE - Criar Saída de Produto
@app.route('/api/exits', methods=['POST'])
def add_exit():
    data = request.json
    new_exit = Exit(
        product_id=data['product_id'],  # Associa a saída ao produto pelo ID
        quantity=int(data['quantity']),  # Quantidade de produtos saindo do estoque
        date_time=datetime.datetime.strptime(data['date_time'], '%Y-%m-%d %H:%M:%S'),  # Converte data para datetime
        location_id=data['location_id']
    )

    # Verifica o saldo atual no StockBalance
    stock_balance = StockBalance.query.filter_by(product_id=new_exit.product_id, location_id=new_exit.location_id).first()
      
    if not stock_balance or stock_balance.balance < new_exit.quantity:
        all_balances = StockBalance.query.filter_by(product_id=new_exit.product_id).all()
        balances_info = [
            {                
                "location_name": balance.location.name,
                "available_balance": balance.balance
            } for balance in all_balances
        ]

        return jsonify({
            "error": "Saldo insuficiente para a saída neste local.",
            "available_balances": balances_info if balances_info else "Não há saldo para este produto em nenhum local."
        }), 400
    
    # Reduz o saldo
    stock_balance.balance -= new_exit.quantity

    db.session.add(new_exit)
    db.session.commit()
    return jsonify({"message": "Saída registrada com sucesso"}), 201


# CREATE - criar um novo local de armazenamento
@app.route('/api/locations', methods=['POST'])
def add_location():
    data = request.json
    new_location = Location(
        name=data.get('name'),
        description=data.get('description')
    )
    db.session.add(new_location)
    db.session.commit()
    return jsonify({"message": "Local de armazenamento adicionado com sucesso"}), 201

# LIST - Obter lista de todos os locais de armazenamento
@app.route('/api/locations', methods=['GET'])
def get_locations():
    locations = Location.query.all()
    location_list = [
        {
            "id": location.id,
            "name": location.name,
            "description": location.description
        } for location in locations
    ]
    return jsonify(location_list), 200

# READ - Obter um único local de armazenamento pelo ID
@app.route('/api/locations/<int:location_id>', methods=['GET'])
def get_location(location_id):
    location = Location.query.get_or_404(location_id)
    return jsonify({
        "id": location.id,
        "name": location.name,
        "description": location.description
    }), 200

# UPDATE - Atualizar um local de armazenamento pelo ID
@app.route('/api/locations/<int:location_id>', methods=['PUT'])
def update_location(location_id):
    location = Location.query.get_or_404(location_id)
    data = request.json

    location.name = data.get('name', location.name)
    location.description = data.get('description', location.description)

    db.session.commit()
    return jsonify({"message": "Local de armazenamento atualizado com sucesso"}), 200

# DELETE - Excluir um local de armazenamento pelo ID
@app.route('/api/locations/<int:location_id>', methods=['DELETE'])
def delete_location(location_id):
    location = Location.query.get_or_404(location_id)
    db.session.delete(location)
    db.session.commit()
    return jsonify({"message": "Local de armazenamento excluído com sucesso"})

# Rota para gerar um relatório PDF com todas as entradas e saídas
@app.route('/api/report', methods=['GET'])
def generate_report():    

    [file, filename] = generate_management_report()
    # Retorna o PDF como um arquivo para download
    return send_file(file, as_attachment=True, download_name = filename)

# Rota para obter todas as movimentações de produtos (entradas e saídas) em ordem crescente de data
@app.route('/api/movements', methods=['GET'])
def get_movements(): 
    return jsonify(movements())

# Rota para obter todas os saldos de produtos 
@app.route('/api/stock_balances', methods=['GET'])
def get_valid_stock_balances():
    # Consulta todos os saldos válidos (com saldo maior que zero)
    valid_balances = StockBalance.query.filter(StockBalance.balance > 0).all()

    # Formata os resultados para JSON, incluindo informações de produto e local
    balances_list = [
        {
            "product_id": balance.product_id,
            "product_name": balance.product.name,
            "location_id": balance.location_id,
            "location_name": balance.location.name,
            "balance": balance.balance
        } for balance in valid_balances
    ]

    return jsonify(balances_list), 200
