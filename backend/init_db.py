import sys
import os

# Ensure project root is on sys.path so `import backend` works
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import app, init_db


if __name__ == '__main__':
    with app.app_context():
        init_db()
        print('DB initialized')
