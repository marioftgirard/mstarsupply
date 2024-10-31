import os

class Config:
    # URI de conexão com o banco de dados MySQL
    SQLALCHEMY_DATABASE_URI = 'mysql://root:@localhost/mstarsupply'
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Desativa o rastreamento de modificações para melhorar o desempenho
    SECRET_KEY = os.getenv('SECRET_KEY', 'im secret')  # Chave secreta para a aplicação (usada para cookies e segurança)
    MYSQL_SSL_DISABLED = True