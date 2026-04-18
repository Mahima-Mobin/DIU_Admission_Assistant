import os
import sys

# Ensure project root is on sys.path
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

# Provide a sensible default DATABASE_URL so this script works standalone
os.environ.setdefault('DATABASE_URL', 'sqlite:///C:/Users/Message Technology/Desktop/Class_work/DIU_Admission_Assistant/backend/diu.sqlite3')

from backend.app import app, init_db

def main():
    with app.app_context():
        init_db()
        print('DB initialized')

if __name__ == '__main__':
    main()
import sys
import os

# Ensure project root is on sys.path so `import backend` works
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import app, init_db


if __name__ == '__main__':
    with app.app_context():
        init_db()
        print('DB initialized')
