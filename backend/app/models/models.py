from sqlalchemy import Column, String, Enum as SQLAlchemyEnum
from app.core.database import Base
import enum
from sqlalchemy import Table, ForeignKey, Column, Integer, Float, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(SQLAlchemyEnum(UserRole), default=UserRole.USER)
    refresh_token = Column(String, nullable=True)
    phone_number = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    address = Column(String)
    orders = relationship("Order", back_populates="user")


class OrderStatus(str, enum.Enum):
    RECEIVED = "received"
    PREPARING = "preparing"
    BAKING = "baking"
    READY = "ready"
    DELIVERED = "delivered"

pizza_toppings = Table(
    'pizza_toppings',
    Base.metadata,
    Column('pizza_id', UUID(as_uuid=True), ForeignKey('pizzas.pizza_id')),
    Column('topping_id', UUID(as_uuid=True), ForeignKey('toppings.topping_id'))
)

class PizzaSizeEnum(str, enum.Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"

class PizzaSize(Base):
    __tablename__ = "s"

    size_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pizza_id = Column(UUID(as_uuid=True), ForeignKey('pizzas.pizza_id'))
    size = Column(SQLAlchemyEnum(PizzaSizeEnum), nullable=False)
    price = Column(Float, nullable=False)
    pizza = relationship("Pizza", back_populates="sizes")

class PizzaCategory(str, enum.Enum):
    BUY1GET4 = "buy1get4"
    VEG_PIZZA = "vegPizza"
    NON_VEG = "nonVeg"
    CLASSIC_MANIA = "classicMania"
    DRINKS = "drinks"

class Pizza(Base):
    __tablename__ = "pizzas"
    
    pizza_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    base_price = Column(Float, nullable=False)
    image_url = Column(String)
    category = Column(SQLAlchemyEnum(PizzaCategory), nullable=False)
    toppings = relationship("Topping", secondary=pizza_toppings, back_populates="pizzas")
    orders = relationship("OrderItem", back_populates="pizza")
    sizes = relationship("PizzaSize", back_populates="pizza")

class Topping(Base):
    __tablename__ = "toppings"
    
    topping_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    price = Column(Float, nullable=False)
    is_vegetarian = Column(Boolean, default=False)
    pizzas = relationship("Pizza", secondary=pizza_toppings, back_populates="toppings")

class Order(Base):
    __tablename__ = "orders"
    
    order_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    total_amount = Column(Float, nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow)
    status = Column(SQLAlchemyEnum(OrderStatus), default=OrderStatus.RECEIVED)
    delivery_address = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    

    items = relationship("OrderItem", back_populates="order")
    user = relationship("User", back_populates="orders")
    # coupon = relationship("Coupon")
    # coupon_usages = relationship("CouponUsage", uselist=False, back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.order_id'), nullable=False)
    pizza_id = Column(UUID(as_uuid=True), ForeignKey('pizzas.pizza_id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    custom_toppings = Column(JSON, default=list)
    size = Column(SQLAlchemyEnum(PizzaSizeEnum), nullable=False)
    
    order = relationship("Order", back_populates="items")
    pizza = relationship("Pizza", back_populates="orders")

class DiscountType(str, enum.Enum):
    PERCENTAGE = "percentage"
    FIXED = "fixed"

class Coupon(Base):
    __tablename__ = "coupons"
    
    coupon_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String, unique=True, nullable=False, index=True)
    discount_type = Column(SQLAlchemyEnum(DiscountType), nullable=False)
    discount_value = Column(Float, nullable=False)  # Percentage or fixed amount
    description = Column(String)
    valid_from = Column(DateTime, nullable=False, default=datetime.utcnow)
    valid_until = Column(DateTime, nullable=False)
    min_order_value = Column(Float, default=0)
    max_discount = Column(Float, nullable=True)  # For percentage discounts
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    usage_limit = Column(Integer, nullable=True)  # NULL means unlimited
    current_usage = Column(Integer, default=0)

class CouponUsage(Base):
    __tablename__ = "coupon_usages"
    
    usage_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    coupon_id = Column(UUID(as_uuid=True), ForeignKey('coupons.coupon_id'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.order_id'), nullable=False)
    used_at = Column(DateTime, default=datetime.utcnow)
    discount_amount = Column(Float, nullable=False)
    # order = relationship("Order", back_populates="coupon_usages")