from models import  Entry, Exit

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