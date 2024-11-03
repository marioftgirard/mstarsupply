from fpdf import FPDF
import os
import datetime
from models import  Entry, Exit,Location

def generate_management_report():
    
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

    absolute_path = os.path.dirname(__file__) # Obtém o caminho absoluto original do arquivo Python
    assets_imgs_path = f'/assets/imgs/logo-white.png' # Define o caminho relativo da imagem logo 
    logo = os.path.dirname(absolute_path) + assets_imgs_path # Concatena o caminho absoluto da pasta raiz com o caminho relativo da imagem 
    
    # Cria o relatório em PDF usando FPDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_xy(0,0)
    pdf.set_left_margin(0)
    pdf.set_right_margin(0)
    pdf.set_font("Arial", size=18)
    pdf.set_fill_color(63,63,63)
    pdf.set_text_color(255,255,255)
    pdf.cell(0, 30,fill=True, ln=True)
    pdf.text(73,16,"Relatório de Movimentação de Mercadorias")
    pdf.cell(200, 10, txt=" ", ln=True)  # Linha em branco para espaçamento
    pdf.image(logo,5,8,55,13)
    pdf.set_left_margin(5)
    pdf.set_right_margin(5)
    pdf.set_font("Arial", size=12)
    pdf.set_fill_color(255,255,255)
    pdf.set_text_color(63,63,63)

    # Cabeçalho da tabela
    pdf.cell(40, 10, "Data", border=1, align="C")
    pdf.cell(30, 10, "Tipo", border=1, align="C")
    pdf.cell(60, 10, "Produto", border=1, align="C")
    pdf.cell(30, 10, "Quantidade", border=1, align="C")
    pdf.cell(40, 10, "Local", border=1, ln=True, align="C")

    pdf.set_font("Arial", size=10)

    # Dados das movimentações
    for movement in movements:
        pdf.cell(40, 10, movement['date_time'].strftime('%d/%m/%Y %H:%M:%S'), border=1, align="C")
        pdf.cell(30, 10, movement['type'], border=1, align="C")
        pdf.cell(60, 10, movement['product_name'], border=1, align="C")
        pdf.cell(30, 10, str(movement['quantity']), border=1, align="C")
        pdf.cell(40, 10, movement['location_name'], border=1, ln=True, align="C")

    # Gera um nome de arquivo único com data e hora
    now = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    report_path = f"/reports/Entries_and_Exits_Report_{now}.pdf"

    # Garante que o diretório 'reports' existe
    os.makedirs(os.path.dirname(report_path), exist_ok=True)

    # Salva o PDF gerado no diretório especificado
    pdf.output(report_path)

    return report_path