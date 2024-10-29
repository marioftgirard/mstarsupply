import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from fpdf import FPDF
from config import Config
from models import db, Product, Entry, Exit

app = Flask(__name__)

app = Flask(__name__)
app.config.from_object(Config)  # Carrega as configurações do banco de dados
db.init_app(app)  # Inicializa o SQLAlchemy com a configuração do app
CORS(app)

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
        quantity=data['quantity'],
        date_time=datetime.datetime.strptime(data['date_time'], '%Y-%m-%d %H:%M:%S'),
        location=data['location']
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"message": "Entrada registrada com sucesso"}), 201

# CREATE - Criar Saída de Produto
@app.route('/api/exits', methods=['POST'])
def add_exit():
    data = request.json
    new_exit = Exit(
        product_id=data['product_id'],  # Associa a saída ao produto pelo ID
        quantity=data['quantity'],  # Quantidade de produtos saindo do estoque
        date_time=datetime.datetime.strptime(data['date_time'], '%Y-%m-%d %H:%M:%S'),  # Converte data para datetime
        location=data['location']
    )
    db.session.add(new_exit)
    db.session.commit()
    return jsonify({"message": "Saída registrada com sucesso"}), 201

# Rota para gerar um relatório PDF com todas as entradas e saídas
@app.route('/api/report', methods=['GET'])
def generate_report():
    entries = Entry.query.all()  # Obtém todas as entradas do banco
    exits = Exit.query.all()  # Obtém todas as saídas do banco
    
    # Cria um novo PDF usando FPDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Relatório de Movimentação de Mercadorias", ln=True, align="C")
    
    # Adiciona as entradas ao relatório PDF
    pdf.cell(200, 10, txt="Entradas", ln=True, align="L")
    for entry in entries:
        pdf.cell(200, 10, txt=f"ID Produto: {entry.product_id} | Quantidade: {entry.quantity} | Data: {entry.date_time} | Local: {entry.location}", ln=True)
    
    # Adiciona as saídas ao relatório PDF
    pdf.cell(200, 10, txt="Saídas", ln=True, align="L")
    for exit in exits:
        pdf.cell(200, 10, txt=f"ID Produto: {exit.product_id} | Quantidade: {exit.quantity} | Data: {exit.date_time} | Local: {exit.location}", ln=True)
    
    format = '%Y-%m-%d %H_%M_%S'
    now = datetime.date.today().strftime(format)
    reportPath = "reports/Entry and Exits Report "+now+".pdf"
    #return jsonify({"message": reportPath}), 201
    pdf.output(reportPath)  # Salva o PDF gerado
    return send_file(reportPath, as_attachment=True)  # Envia o PDF como resposta

