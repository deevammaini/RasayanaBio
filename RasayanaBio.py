from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rasayanabio.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

db = SQLAlchemy(app)
CORS(app)
mail = Mail(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    orders = db.relationship('Order', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    short_description = db.Column(db.String(500))
    price = db.Column(db.Float, nullable=False)
    sale_price = db.Column(db.Float)
    category = db.Column(db.String(100))
    tags = db.Column(db.String(300))  # Comma-separated
    image_url = db.Column(db.String(500))
    stock_quantity = db.Column(db.Integer, default=0)
    ingredients = db.Column(db.Text)
    benefits = db.Column(db.Text)
    usage_instructions = db.Column(db.Text)
    is_vegan = db.Column(db.Boolean, default=True)
    is_gmo_free = db.Column(db.Boolean, default=True)
    is_gluten_free = db.Column(db.Boolean, default=True)
    qr_code = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviews = db.relationship('Review', backref='product', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    session_id = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade='all, delete-orphan')

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    product = db.relationship('Product')

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, processing, shipped, delivered, cancelled
    shipping_address = db.Column(db.Text)
    billing_address = db.Column(db.Text)
    payment_method = db.Column(db.String(50))
    payment_status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    title = db.Column(db.String(200))
    comment = db.Column(db.Text)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='new')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# JWT Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split()[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        email=data['email'],
        password_hash=hashed_password,
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        phone=data.get('phone', '')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
    }), 200

# Product Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    
    query = Product.query
    
    if category:
        query = query.filter_by(category=category)
    
    if search:
        query = query.filter(Product.name.contains(search) | Product.description.contains(search))
    
    products = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'products': [{
            'id': p.id,
            'name': p.name,
            'description': p.short_description,
            'price': p.price,
            'sale_price': p.sale_price,
            'category': p.category,
            'image_url': p.image_url,
            'is_vegan': p.is_vegan,
            'is_gmo_free': p.is_gmo_free,
            'is_gluten_free': p.is_gluten_free,
            'stock_quantity': p.stock_quantity
        } for p in products.items],
        'total': products.total,
        'pages': products.pages,
        'current_page': page
    }), 200

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    
    # Get average rating
    reviews = Review.query.filter_by(product_id=product_id).all()
    avg_rating = sum([r.rating for r in reviews]) / len(reviews) if reviews else 0
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'short_description': product.short_description,
        'price': product.price,
        'sale_price': product.sale_price,
        'category': product.category,
        'tags': product.tags.split(',') if product.tags else [],
        'image_url': product.image_url,
        'ingredients': product.ingredients,
        'benefits': product.benefits,
        'usage_instructions': product.usage_instructions,
        'is_vegan': product.is_vegan,
        'is_gmo_free': product.is_gmo_free,
        'is_gluten_free': product.is_gluten_free,
        'stock_quantity': product.stock_quantity,
        'qr_code': product.qr_code,
        'average_rating': round(avg_rating, 1),
        'review_count': len(reviews)
    }), 200

# Cart Routes
@app.route('/api/cart', methods=['GET'])
def get_cart():
    token = request.headers.get('Authorization')
    
    if token:
        try:
            token = token.split()[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            cart = Cart.query.filter_by(user_id=data['user_id']).first()
        except:
            session_id = request.headers.get('Session-Id', 'guest')
            cart = Cart.query.filter_by(session_id=session_id).first()
    else:
        session_id = request.headers.get('Session-Id', 'guest')
        cart = Cart.query.filter_by(session_id=session_id).first()
    
    if not cart:
        return jsonify({'items': [], 'total': 0}), 200
    
    items = [{
        'id': item.id,
        'product': {
            'id': item.product.id,
            'name': item.product.name,
            'price': item.product.sale_price or item.product.price,
            'image_url': item.product.image_url
        },
        'quantity': item.quantity,
        'subtotal': (item.product.sale_price or item.product.price) * item.quantity
    } for item in cart.items]
    
    total = sum([item['subtotal'] for item in items])
    
    return jsonify({'items': items, 'total': total}), 200

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    product_id = data['product_id']
    quantity = data.get('quantity', 1)
    
    token = request.headers.get('Authorization')
    
    if token:
        try:
            token = token.split()[1]
            user_data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            cart = Cart.query.filter_by(user_id=user_data['user_id']).first()
            if not cart:
                cart = Cart(user_id=user_data['user_id'])
                db.session.add(cart)
        except:
            session_id = request.headers.get('Session-Id', 'guest')
            cart = Cart.query.filter_by(session_id=session_id).first()
            if not cart:
                cart = Cart(session_id=session_id)
                db.session.add(cart)
    else:
        session_id = request.headers.get('Session-Id', 'guest')
        cart = Cart.query.filter_by(session_id=session_id).first()
        if not cart:
            cart = Cart(session_id=session_id)
            db.session.add(cart)
    
    # Check if item already in cart
    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
    
    db.session.commit()
    
    return jsonify({'message': 'Product added to cart'}), 200

@app.route('/api/cart/update/<int:item_id>', methods=['PUT'])
def update_cart_item(item_id):
    data = request.get_json()
    cart_item = CartItem.query.get_or_404(item_id)
    cart_item.quantity = data['quantity']
    db.session.commit()
    
    return jsonify({'message': 'Cart updated'}), 200

@app.route('/api/cart/remove/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from cart'}), 200

# Order Routes
@app.route('/api/orders', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json()
    
    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart or not cart.items:
        return jsonify({'message': 'Cart is empty'}), 400
    
    # Calculate total
    total = sum([(item.product.sale_price or item.product.price) * item.quantity for item in cart.items])
    
    # Create order
    order_number = f"ORD-{datetime.utcnow().strftime('%Y%m%d')}-{current_user.id}-{Order.query.count() + 1}"
    new_order = Order(
        user_id=current_user.id,
        order_number=order_number,
        total_amount=total,
        shipping_address=data['shipping_address'],
        billing_address=data.get('billing_address', data['shipping_address']),
        payment_method=data['payment_method']
    )
    
    db.session.add(new_order)
    db.session.flush()
    
    # Create order items
    for item in cart.items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.sale_price or item.product.price
        )
        db.session.add(order_item)
    
    # Clear cart
    for item in cart.items:
        db.session.delete(item)
    
    db.session.commit()
    
    # Send confirmation email
    try:
        send_order_confirmation_email(current_user.email, order_number)
    except:
        pass
    
    return jsonify({
        'message': 'Order created successfully',
        'order_number': order_number,
        'order_id': new_order.id
    }), 201

@app.route('/api/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'orders': [{
            'id': o.id,
            'order_number': o.order_number,
            'total_amount': o.total_amount,
            'status': o.status,
            'payment_status': o.payment_status,
            'created_at': o.created_at.isoformat(),
            'items_count': len(o.items)
        } for o in orders]
    }), 200

@app.route('/api/orders/<int:order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    order = Order.query.filter_by(id=order_id, user_id=current_user.id).first_or_404()
    
    return jsonify({
        'id': order.id,
        'order_number': order.order_number,
        'total_amount': order.total_amount,
        'status': order.status,
        'payment_status': order.payment_status,
        'shipping_address': order.shipping_address,
        'billing_address': order.billing_address,
        'payment_method': order.payment_method,
        'created_at': order.created_at.isoformat(),
        'items': [{
            'product': {
                'id': item.product.id,
                'name': item.product.name,
                'image_url': item.product.image_url
            },
            'quantity': item.quantity,
            'price': item.price
        } for item in order.items]
    }), 200

# Review Routes
@app.route('/api/reviews', methods=['POST'])
@token_required
def create_review(current_user):
    data = request.get_json()
    
    # Check if user already reviewed this product
    existing_review = Review.query.filter_by(
        user_id=current_user.id,
        product_id=data['product_id']
    ).first()
    
    if existing_review:
        return jsonify({'message': 'You have already reviewed this product'}), 400
    
    new_review = Review(
        user_id=current_user.id,
        product_id=data['product_id'],
        rating=data['rating'],
        title=data.get('title', ''),
        comment=data.get('comment', '')
    )
    
    db.session.add(new_review)
    db.session.commit()
    
    return jsonify({'message': 'Review submitted successfully'}), 201

@app.route('/api/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
    
    return jsonify({
        'reviews': [{
            'id': r.id,
            'user_name': f"{r.user.first_name} {r.user.last_name}",
            'rating': r.rating,
            'title': r.title,
            'comment': r.comment,
            'is_verified': r.is_verified,
            'created_at': r.created_at.isoformat()
        } for r in reviews]
    }), 200

# Contact Routes
@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    
    new_message = ContactMessage(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone', ''),
        subject=data.get('subject', ''),
        message=data['message']
    )
    
    db.session.add(new_message)
    db.session.commit()
    
    # Send notification email
    try:
        send_contact_notification_email(data)
    except:
        pass
    
    return jsonify({'message': 'Message sent successfully'}), 201

# Helper Functions
def send_order_confirmation_email(email, order_number):
    msg = Message(
        'Order Confirmation - RasayanaBio',
        sender=app.config['MAIL_USERNAME'],
        recipients=[email]
    )
    msg.body = f"""
    Thank you for your order!
    
    Your order number is: {order_number}
    
    We will send you a shipping confirmation email once your order ships.
    
    Best regards,
    RasayanaBio Team
    """
    mail.send(msg)

def send_contact_notification_email(data):
    msg = Message(
        f"New Contact Message: {data.get('subject', 'No Subject')}",
        sender=app.config['MAIL_USERNAME'],
        recipients=[app.config['MAIL_USERNAME']]
    )
    msg.body = f"""
    New contact message received:
    
    Name: {data['name']}
    Email: {data['email']}
    Phone: {data.get('phone', 'N/A')}
    Subject: {data.get('subject', 'N/A')}
    
    Message:
    {data['message']}
    """
    mail.send(msg)

# Initialize database
def create_tables():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)