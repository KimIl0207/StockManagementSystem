from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
import json
from datetime import datetime

STOCK_FILE = 'stock.json'
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def jsonToExcel(file_name):
    with open(file_name, 'r', encoding="utf-8") as f:
        data = json.loads(f)
    
    df = pd.DataFrame(list(data.items()), columns=['제품', '수량'])
    df.to_excel(file_name, index=False, encoding='openpyxl')

def load_stock():
    if not os.path.exists('stock.json'):
        return {}
    with open(STOCK_FILE, 'r', encoding="utf-8") as f:
        return json.load(f)
    
def save_stock(stock):
    with open(STOCK_FILE, 'w', encoding="utf-8") as f:
        json.dump(stock, f, ensure_ascii=False, indent=4)

app = Flask(__name__, static_folder='../client/build', static_url_path='/')
CORS(app)

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/stock', methods=['POST'])
def update_stock():
    data = request.get_json()
    if not data or 'name' not in data or 'count' not in data:
        return jsonify({'error': 'No data provided'}), 400
    stock = load_stock()
    name = data['name']
    count = data['count']
    today = datetime.today().strftime('%Y-%m-%d')
    if name not in stock:
        stock[name] = []

    stock[name].append({
        'date': today,
        'count': count
    })
    save_stock(stock)
    return jsonify({'message': 'Stock updated successfully'}), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {'error': 'No file part'}, 400

    file = request.files['file']
    if file.filename == '':
        return {'error': 'No selected file'}, 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # 파일 처리
    if file.filename.endswith('.json'):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    elif file.filename.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(filepath)
        data = df.to_dict(orient='records')
    else:
        return {'error': 'Unsupported file type'}, 400

    return {'message': 'File uploaded', 'data': data}, 200

@app.route('/save', methods=['POST'])
def save_uploaded_stock():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    save_stock(data)
    return jsonify({'message': 'Saved to stock.json'}), 200

@app.route('/stock', methods=['GET'])
def get_stock():
    stock = load_stock()
    return jsonify(stock), 200


@app.route('/stock/<name>', methods=['DELETE'])
def delete_stock(name):
    stock = load_stock()
    if name in stock:
        del stock[name]
        save_stock(stock)
        return jsonify({'message': 'Stock deleted successfully'}), 200
    else:
        return jsonify({'error': 'Stock not found'}), 404

@app.route('/stock/download', methods=['GET'])
def download_excel():
    json_file = STOCK_FILE
    excel_file = 'stock.xlsx'
    jsonToExcel(json_file, excel_file)
    return jsonify({'message': 'Excel file created successfully', 'file': excel_file}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)