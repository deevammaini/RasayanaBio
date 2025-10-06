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
    warnings = db.Column(db.Text)
    is_vegan = db.Column(db.Boolean, default=True)
    is_gmo_free = db.Column(db.Boolean, default=True)
    is_gluten_free = db.Column(db.Boolean, default=True)
    qr_code = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviews = db.relationship('Review', backref='product', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    faqs = db.relationship('ProductFAQ', backref='product', lazy=True)

class ProductFAQ(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    question = db.Column(db.String(500), nullable=False)
    answer = db.Column(db.Text, nullable=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
    pack_size = db.Column(db.String(50), default='1')  # 1, 2, 3 bottles
    unit_price = db.Column(db.Float, nullable=False)  # Price per unit based on pack
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

class Coupon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))
    discount_type = db.Column(db.String(20), nullable=False)  # 'percentage' or 'fixed'
    discount_value = db.Column(db.Float, nullable=False)  # percentage (0-100) or fixed amount
    min_order_amount = db.Column(db.Float, default=0)
    max_discount_amount = db.Column(db.Float)  # For percentage discounts
    usage_limit = db.Column(db.Integer)  # Total usage limit
    used_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    valid_from = db.Column(db.DateTime, default=datetime.utcnow)
    valid_until = db.Column(db.DateTime)
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
    
    # Get FAQs
    faqs = ProductFAQ.query.filter_by(product_id=product_id).order_by(ProductFAQ.order).all()
    
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
        'warnings': product.warnings,
        'is_vegan': product.is_vegan,
        'is_gmo_free': product.is_gmo_free,
        'is_gluten_free': product.is_gluten_free,
        'stock_quantity': product.stock_quantity,
        'qr_code': product.qr_code,
        'average_rating': round(avg_rating, 1),
        'review_count': len(reviews),
        'faqs': [{
            'question': faq.question,
            'answer': faq.answer
        } for faq in faqs]
    }), 200

@app.route('/api/products/<int:product_id>/packs', methods=['GET'])
def get_product_packs(product_id):
    """Get pack pricing information for a product"""
    product = Product.query.get_or_404(product_id)
    base_price = product.sale_price or product.price
    
    packs = [
        {
            'pack_size': '1',
            'bottles': 1,
            'tablets': 60,
            'duration': '1 Month',
            'discount_percent': 0,
            'original_price': base_price,
            'final_price': base_price,
            'savings': 0
        },
        {
            'pack_size': '2',
            'bottles': 2,
            'tablets': 120,
            'duration': '2 Months',
            'discount_percent': 33,
            'original_price': base_price * 2,
            'final_price': round(base_price * 2 * 0.67, 2),
            'savings': round(base_price * 2 * 0.33, 2)
        },
        {
            'pack_size': '3',
            'bottles': 3,
            'tablets': 180,
            'duration': '3 Months',
            'discount_percent': 40,
            'original_price': base_price * 3,
            'final_price': round(base_price * 3 * 0.60, 2),
            'savings': round(base_price * 3 * 0.40, 2)
        }
    ]
    
    return jsonify({'packs': packs}), 200

@app.route('/api/coupons/validate', methods=['POST'])
def validate_coupon_endpoint():
    """Validate coupon code"""
    data = request.get_json()
    code = data.get('code', '').strip().upper()
    subtotal = data.get('subtotal', 0)
    
    if not code:
        return jsonify({'valid': False, 'message': 'Coupon code is required'}), 400
    
    result = validate_coupon(code, subtotal)
    
    if result['valid']:
        return jsonify(result), 200
    else:
        return jsonify(result), 400

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
        return jsonify({
            'items': [], 
            'subtotal': 0,
            'coupon_discount': 0,
            'discounted_subtotal': 0,
            'cgst': 0,
            'sgst': 0,
            'total_tax': 0,
            'total': 0,
            'applied_coupon': None
        }), 200
    
    items = []
    subtotal = 0
    
    for item in cart.items:
        pack_price = calculate_pack_price(item.product, item.pack_size)
        item_subtotal = pack_price * item.quantity
        subtotal += item_subtotal
        
        items.append({
            'id': item.id,
            'product': {
                'id': item.product.id,
                'name': item.product.name,
                'price': item.product.sale_price or item.product.price,
                'image_url': item.product.image_url
            },
            'quantity': item.quantity,
            'pack_size': item.pack_size,
            'unit_price': pack_price,
            'subtotal': item_subtotal
        })
    
    # Calculate taxes
    taxes = calculate_taxes(subtotal)
    
    # Check for applied coupon
    applied_coupon = None
    coupon_discount = 0
    
    # Get coupon from request headers or session
    coupon_code = request.headers.get('Coupon-Code')
    if coupon_code:
        coupon_result = validate_coupon(coupon_code, subtotal)
        if coupon_result['valid']:
            applied_coupon = coupon_result['coupon']
            coupon_discount = applied_coupon['discount_amount']
    
    # Calculate final total
    discounted_subtotal = subtotal - coupon_discount
    final_taxes = calculate_taxes(discounted_subtotal)
    final_total = discounted_subtotal + final_taxes['total_tax']
    
    return jsonify({
        'items': items,
        'subtotal': round(subtotal, 2),
        'coupon_discount': round(coupon_discount, 2),
        'discounted_subtotal': round(discounted_subtotal, 2),
        'cgst': round(final_taxes['cgst'], 2),
        'sgst': round(final_taxes['sgst'], 2),
        'total_tax': round(final_taxes['total_tax'], 2),
        'total': round(final_total, 2),
        'applied_coupon': applied_coupon
    }), 200

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    product_id = data['product_id']
    quantity = data.get('quantity', 1)
    pack_size = data.get('pack_size', '1')  # Default to 1 bottle
    
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
    
    # Get product to calculate pack price
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    
    pack_price = calculate_pack_price(product, pack_size)
    
    # Check if item with same product and pack size already in cart
    cart_item = CartItem.query.filter_by(
        cart_id=cart.id, 
        product_id=product_id, 
        pack_size=pack_size
    ).first()
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id, 
            product_id=product_id, 
            quantity=quantity,
            pack_size=pack_size,
            unit_price=pack_price
        )
        db.session.add(cart_item)
    
    db.session.commit()
    
    return jsonify({'message': 'Product added to cart'}), 200

@app.route('/api/cart/update/<int:item_id>', methods=['PUT'])
def update_cart_item(item_id):
    data = request.get_json()
    cart_item = CartItem.query.get_or_404(item_id)
    
    # Update quantity if provided
    if 'quantity' in data and data['quantity'] is not None:
        cart_item.quantity = data['quantity']
    
    # Update pack size if provided
    if 'pack_size' in data and data['pack_size'] is not None:
        cart_item.pack_size = data['pack_size']
        # Recalculate unit price based on new pack size
        cart_item.unit_price = calculate_pack_price(cart_item.product, data['pack_size'])
    
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
def calculate_pack_price(product, pack_size):
    """Calculate price based on pack size with discounts"""
    base_price = product.sale_price or product.price
    
    if pack_size == '1':
        return base_price
    elif pack_size == '2':
        # 33% discount for 2 bottles
        return base_price * 2 * 0.67
    elif pack_size == '3':
        # 40% discount for 3 bottles
        return base_price * 3 * 0.60
    else:
        return base_price

def calculate_taxes(subtotal):
    """Calculate CGST and SGST taxes"""
    cgst_rate = 0.09  # 9%
    sgst_rate = 0.09  # 9%
    
    cgst = subtotal * cgst_rate
    sgst = subtotal * sgst_rate
    total_tax = cgst + sgst
    
    return {
        'cgst': round(cgst, 2),
        'sgst': round(sgst, 2),
        'total_tax': round(total_tax, 2)
    }

def calculate_coupon_discount(coupon, subtotal):
    if not coupon or not coupon.is_active:
        return 0
    
    # Check if coupon is still valid
    now = datetime.utcnow()
    if coupon.valid_until and now > coupon.valid_until:
        return 0
    
    # Check minimum order amount
    if subtotal < coupon.min_order_amount:
        return 0
    
    # Check usage limit
    if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
        return 0
    
    if coupon.discount_type == 'percentage':
        discount_amount = subtotal * (coupon.discount_value / 100)
        # Apply max discount limit if set
        if coupon.max_discount_amount:
            discount_amount = min(discount_amount, coupon.max_discount_amount)
        return round(discount_amount, 2)
    elif coupon.discount_type == 'fixed':
        return min(coupon.discount_value, subtotal)  # Can't discount more than subtotal
    
    return 0

def validate_coupon(code, subtotal):
    """Validate coupon and return discount amount"""
    coupon = Coupon.query.filter_by(code=code.upper()).first()
    
    if not coupon:
        return {'valid': False, 'message': 'Invalid coupon code'}
    
    if not coupon.is_active:
        return {'valid': False, 'message': 'Coupon is not active'}
    
    now = datetime.utcnow()
    if coupon.valid_until and now > coupon.valid_until:
        return {'valid': False, 'message': 'Coupon has expired'}
    
    if subtotal < coupon.min_order_amount:
        return {'valid': False, 'message': f'Minimum order amount of ₹{coupon.min_order_amount} required'}
    
    if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
        return {'valid': False, 'message': 'Coupon usage limit exceeded'}
    
    discount_amount = calculate_coupon_discount(coupon, subtotal)
    
    return {
        'valid': True,
        'coupon': {
            'id': coupon.id,
            'code': coupon.code,
            'description': coupon.description,
            'discount_type': coupon.discount_type,
            'discount_value': coupon.discount_value,
            'discount_amount': discount_amount
        }
    }

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

# Database Migration Function
def migrate_database():
    """Add missing columns to existing database"""
    with app.app_context():
        try:
            # Try to add missing columns if they don't exist
            with db.engine.connect() as conn:
                # Check if warnings column exists
                result = conn.execute(db.text("PRAGMA table_info(product)"))
                columns = [row[1] for row in result]
                
                if 'warnings' not in columns:
                    print("Adding 'warnings' column to product table...")
                    conn.execute(db.text("ALTER TABLE product ADD COLUMN warnings TEXT"))
                    conn.commit()
                    print("Column added successfully!")
                
                # Check if cart_item table has new columns
                result = conn.execute(db.text("PRAGMA table_info(cart_item)"))
                cart_columns = [row[1] for row in result]
                
                if 'pack_size' not in cart_columns:
                    print("Adding 'pack_size' column to cart_item table...")
                    conn.execute(db.text("ALTER TABLE cart_item ADD COLUMN pack_size VARCHAR(50) DEFAULT '1'"))
                    conn.commit()
                    print("Pack size column added successfully!")
                
                if 'unit_price' not in cart_columns:
                    print("Adding 'unit_price' column to cart_item table...")
                    conn.execute(db.text("ALTER TABLE cart_item ADD COLUMN unit_price FLOAT"))
                    conn.commit()
                    print("Unit price column added successfully!")
                
                # Check if product_faq table exists
                result = conn.execute(db.text("SELECT name FROM sqlite_master WHERE type='table' AND name='product_faq'"))
                if not result.fetchone():
                    print("Creating product_faq table...")
                    db.create_all()
                    print("Table created successfully!")
                
                # Check if coupon table exists
                result = conn.execute(db.text("SELECT name FROM sqlite_master WHERE type='table' AND name='coupon'"))
                if not result.fetchone():
                    print("Creating coupon table...")
                    db.create_all()
                    print("Coupon table created successfully!")
        except Exception as e:
            print(f"Migration note: {e}")

# Seed Data Function
def seed_female_vitality_product():
    """Add Female Vitality product to database"""
    with app.app_context():
        # Check if product already exists
        existing = Product.query.filter_by(name='Female Vitality').first()
        if existing:
            print("Female Vitality product already exists")
            return
        
        # Create Female Vitality product
        female_vitality = Product(
            name='Female Vitality',
            description='''Experience renewed energy, enhanced mood, and optimal hormonal balance with our comprehensive female vitality supplement. Our carefully curated formula combines powerful antioxidants, essential vitamins, and minerals to support overall well-being and radiant health.

Experience a balanced and harmonious life with our all-natural supplement designed to support women's overall health. Our unique blend of botanicals helps regulate boost energy levels, enhance your mood, immune function, and promote overall well-being.''',
            short_description='Supports hormonal balance, rejuvenates physical and mental health, manages stress and anxiety, and supports immunity.',
            price=1199.00,
            sale_price=840.00,
            category='Women\'s Health',
            tags='hormonal balance,energy,mood,immunity,stress relief,women wellness',
            image_url='/static/images/female-vitality.jpg',
            stock_quantity=100,
            ingredients='Ashwagandha- 80 mg, Shatavari (Asparagus racemosus)- 160 mg, Triphala- 60 mg, Maca root (Lepidium meyenii)- 40 mg and Damiana (Turnera diffusa)- 60 mg',
            benefits='''• Supports Energy & Mood
• Boosts Immunity
• Natural Energy Supplement
• Reduce Stress & Anxiety
• Enhance Stamina & Endurance
• Boost mood, focus, and overall sense of well-being
• Supports Hormonal Balance
• Rejuvenate Physical and Mental Health''',
            usage_instructions='A healthy Adult can take one tablet twice a day with water or as advised by a physician or a healthcare professional.',
            warnings='Keep out of reach of children. Do not take this or any other supplement if under the age of 18, pregnant or nursing a baby, or if you have any known or suspected medical conditions, and/or taking prescription drugs or over the counter medications. Always consult with a qualified health physician/Nutritionist before taking any new dietary supplement.',
            is_vegan=True,
            is_gmo_free=True,
            is_gluten_free=True
        )
        
        db.session.add(female_vitality)
        db.session.flush()
        
        # Add FAQs for Female Vitality
        faqs = [
            {
                'question': 'Who should take Female Vitality supplement?',
                'answer': 'If your stamina is poor, feel lethargic most of the time, dealing with hormonal issues or have low libido then you should start consuming this product.',
                'order': 1
            },
            {
                'question': 'Can I take this supplement if I have medical conditions?',
                'answer': 'It\'s best to consult your healthcare provider before using the product if you have any underlying medical conditions.',
                'order': 2
            },
            {
                'question': 'How long before I see results?',
                'answer': 'Most women report noticeable improvements in energy and desire within 30 days, with full effects after 3 months of consistent use.',
                'order': 3
            },
            {
                'question': 'Does this help with stress and anxiety?',
                'answer': 'Yes, it contains natural adaptogens like Ashwagandha, maca root and shatavari, known to suppress stress and anxiety which directly support hormonal balance and improve overall reproductive health.',
                'order': 4
            }
        ]
        
        for faq_data in faqs:
            faq = ProductFAQ(
                product_id=female_vitality.id,
                question=faq_data['question'],
                answer=faq_data['answer'],
                order=faq_data['order']
            )
            db.session.add(faq)
        
        db.session.commit()
        print("Female Vitality product added successfully!")

def seed_sample_coupons():
    """Add sample coupons to database"""
    with app.app_context():
        # Check if coupons already exist
        if Coupon.query.count() > 0:
            print("Coupons already exist")
            return
        
        # Create sample coupons
        sample_coupons = [
            {
                'code': 'WELCOME10',
                'description': 'Welcome discount for new customers',
                'discount_type': 'percentage',
                'discount_value': 10,
                'min_order_amount': 500,
                'max_discount_amount': 200,
                'usage_limit': 100,
                'is_active': True,
                'valid_until': datetime.utcnow() + timedelta(days=30)
            },
            {
                'code': 'SAVE50',
                'description': 'Flat ₹50 off on orders above ₹1000',
                'discount_type': 'fixed',
                'discount_value': 50,
                'min_order_amount': 1000,
                'usage_limit': 50,
                'is_active': True,
                'valid_until': datetime.utcnow() + timedelta(days=15)
            },
            {
                'code': 'BULK20',
                'description': '20% off on bulk orders above ₹2000',
                'discount_type': 'percentage',
                'discount_value': 20,
                'min_order_amount': 2000,
                'max_discount_amount': 500,
                'usage_limit': 25,
                'is_active': True,
                'valid_until': datetime.utcnow() + timedelta(days=60)
            }
        ]
        
        for coupon_data in sample_coupons:
            coupon = Coupon(**coupon_data)
            db.session.add(coupon)
        
        db.session.commit()
        print("Sample coupons added successfully!")

# Initialize database
def create_tables():
    with app.app_context():
        db.create_all()
        # Run migration to add missing columns
        migrate_database()
        # Seed Female Vitality product
        seed_female_vitality_product()
        # Seed sample coupons
        seed_sample_coupons()

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)