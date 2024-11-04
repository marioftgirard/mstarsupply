from fpdf import FPDF
import os
import datetime
from utils.util_functions import movements as getMovements, aggregated_balances as getBalances

def generate_management_report():
    
    
    # Obtém as movimentações
    movements = getMovements()

    # Consulta agregada para obter os saldos totais por produto
    product_balances = getBalances()

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
    pdf.cell(200, 10, txt=" ", ln=True)  
    pdf.image(logo,5,8,55,13)
    pdf.set_left_margin(5)
    pdf.set_right_margin(5)
    pdf.set_fill_color(255,255,255)
    pdf.set_text_color(63,63,63)

    pdf.set_font("Arial", "B", size=12)
    pdf.cell(0, 10, "Entradas e Saídas", ln=True, align="L")

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

    # Cabeçalho da tabela de saldos agrupados por produto
    pdf.cell(200, 10, txt=" ", ln=True)  # Linha em branco para espaçamento
    pdf.set_font("Arial", "B", size=12)
    pdf.cell(0, 10, "Saldos Agrupados por Produto", ln=True, align="L")
    pdf.cell(100, 10, "Produto", border=1, align="C")
    pdf.cell(50, 10, "Saldo Total", border=1, ln=True, align="C")
    pdf.set_font("Arial", size=10)

     # Dados dos saldos agrupados por produto
    for balance in product_balances:
        pdf.cell(100, 10, balance.product_name, border=1, align="C")
        pdf.cell(50, 10, str(balance.total_balance), border=1, ln=True, align="C")

    # Gera um nome de arquivo único com data e hora
    now = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    file_name = f"Entries_and_Exits_Report_{now}.pdf"
    report_path = f"/reports/" + file_name

    # Garante que o diretório 'reports' existe
    os.makedirs(os.path.dirname(report_path), exist_ok=True)

    # Salva o PDF gerado no diretório especificado
    pdf.output(report_path)

    return [report_path, file_name]