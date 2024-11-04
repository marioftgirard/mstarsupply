from sqlalchemy import func
from models import  Entry, Exit, Product,db,StockBalance

def movements(options = None):
    
    entries = Entry.query.all()  # Obtém todas as entradas do banco
    exits = Exit.query.all()  # Obtém todas as saídas do banco     

    # Combina entradas e saídas em uma única lista de movimentações
    movements = [
        {
            "type": "Entrada",
            "product_name": entry.product.name,
            "quantity": entry.quantity,
            "date_time": entry.date_time,
            "location_name": entry.location.name
        } for entry in entries
    ] + [
        {
            "type": "Saída",
            "product_name": exit.product.name,
            "quantity": exit.quantity,
            "date_time": exit.date_time,
            "location_name": exit.location.name
        } for exit in exits
    ]

    # Ordena as movimentações por data em ordem crescente
    movements.sort(key=lambda x: x['date_time'])

   
    return movements

def aggregated_balances():
    product_balances = db.session.query(
        StockBalance.product_id,
        Product.name.label("product_name"),  # Acessa o nome do produto a partir da tabela Product
        func.sum(StockBalance.balance).label("total_balance")
    ).join(Product, StockBalance.product_id == Product.id).group_by(StockBalance.product_id, Product.name).all()

    return product_balances