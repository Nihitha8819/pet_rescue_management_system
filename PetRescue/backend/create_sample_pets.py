"""
Script to create sample pets for testing
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from apps.pets.models import Pet
from apps.users.models import User

def create_sample_pets():
    # Get or create a user for the pets
    user = User.objects.filter(email='test@example.com').first()
    if not user:
        user = User.objects.create_user(
            email='testowner@example.com',
            username='petowner',
            password='testpass123',
            phone_number='1234567890',
            role='rescuer'
        )
        print(f"Created user: {user.email}")
    else:
        print(f"Using existing user: {user.email}")
    
    # Sample pets data
    sample_pets = [
        {
            'name': 'Max',
            'pet_type': 'dog',
            'breed': 'Golden Retriever',
            'age': 3,
            'gender': 'male',
            'size': 'large',
            'color': 'Golden',
            'location': 'New York, NY',
            'description': 'Friendly and energetic dog, great with kids and loves to play fetch. Healthy, all vaccinations up to date.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400'],
            'created_by': user
        },
        {
            'name': 'Luna',
            'pet_type': 'cat',
            'breed': 'Persian',
            'age': 2,
            'gender': 'female',
            'size': 'medium',
            'color': 'White',
            'location': 'Los Angeles, CA',
            'description': 'Sweet and cuddly cat, loves to nap in sunny spots. Healthy, spayed.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1573865526739-10c1dd7aa5fd?w=400'],
            'created_by': user
        },
        {
            'name': 'Buddy',
            'pet_type': 'dog',
            'breed': 'Labrador',
            'age': 4,
            'gender': 'male',
            'size': 'large',
            'color': 'Black',
            'location': 'Chicago, IL',
            'description': 'Calm and well-trained dog, perfect for families. Healthy, neutered.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'],
            'created_by': user
        },
        {
            'name': 'Whiskers',
            'pet_type': 'cat',
            'breed': 'Tabby',
            'age': 1,
            'gender': 'male',
            'size': 'small',
            'color': 'Orange',
            'location': 'San Francisco, CA',
            'description': 'Playful kitten, loves toys and attention. Healthy, all shots current.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400'],
            'created_by': user
        },
        {
            'name': 'Rocky',
            'pet_type': 'dog',
            'breed': 'German Shepherd',
            'age': 5,
            'gender': 'male',
            'size': 'large',
            'color': 'Brown and Black',
            'location': 'Houston, TX',
            'description': 'Loyal and protective dog, needs experienced owner. Healthy, trained.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1568572933382-74d440642117?w=400'],
            'created_by': user
        },
        {
            'name': 'Mittens',
            'pet_type': 'cat',
            'breed': 'Siamese',
            'age': 3,
            'gender': 'female',
            'size': 'medium',
            'color': 'Cream and Brown',
            'location': 'Seattle, WA',
            'description': 'Vocal and affectionate cat, loves human company. Healthy.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400'],
            'created_by': user
        },
        {
            'name': 'Charlie',
            'pet_type': 'dog',
            'breed': 'Beagle',
            'age': 2,
            'gender': 'male',
            'size': 'medium',
            'color': 'Tri-color',
            'location': 'Boston, MA',
            'description': 'Energetic and curious dog, loves exploring outdoors. Healthy, neutered.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400'],
            'created_by': user
        },
        {
            'name': 'Shadow',
            'pet_type': 'cat',
            'breed': 'Black Cat',
            'age': 4,
            'gender': 'male',
            'size': 'medium',
            'color': 'Black',
            'location': 'Miami, FL',
            'description': 'Independent cat, good with other pets. Healthy.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400'],
            'created_by': user
        },
        {
            'name': 'Daisy',
            'pet_type': 'dog',
            'breed': 'Poodle',
            'age': 3,
            'gender': 'female',
            'size': 'small',
            'color': 'White',
            'location': 'Austin, TX',
            'description': 'Smart and hypoallergenic dog, great for apartments. Healthy, spayed.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400'],
            'created_by': user
        },
        {
            'name': 'Oliver',
            'pet_type': 'cat',
            'breed': 'Maine Coon',
            'age': 2,
            'gender': 'male',
            'size': 'large',
            'color': 'Gray',
            'location': 'Portland, OR',
            'description': 'Gentle giant, loves to be brushed and petted. Healthy.',
            'status': 'available',
            'images': ['https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400'],
            'created_by': user
        }
    ]
    
    # Create pets
    created_count = 0
    for pet_data in sample_pets:
        # Check if pet already exists
        if not Pet.objects.filter(name=pet_data['name'], created_by=user).exists():
            Pet.objects.create(**pet_data)
            created_count += 1
            print(f"Created pet: {pet_data['name']}")
        else:
            print(f"Pet already exists: {pet_data['name']}")
    
    print(f"\nTotal pets created: {created_count}")
    print(f"Total pets in database: {Pet.objects.count()}")

if __name__ == '__main__':
    create_sample_pets()
