/* data.js - Shared Data Manager */

const DB_KEYS = {
    PHOTOS: 'photographer_photos_v2', // Bumped version for new schema
    ORDERS: 'photographer_orders_v1'
};

const DEFAULT_PHOTOS = [
    // Wedding
    { id: 1, category: 'Wedding', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200', alt: 'Wedding Ceremony', caption: 'Wedding — Vows and Love' },
    { id: 11, category: 'Wedding', src: 'https://images.unsplash.com/photo-1511285560982-1356c11d4606?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1511285560982-1356c11d4606?auto=format&fit=crop&q=80&w=1200', alt: 'Wedding Party', caption: 'Wedding — Celebration Dance' },
    { id: 12, category: 'Wedding', src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200', alt: 'Wedding Indian Bride', caption: 'Wedding — The Bride' },
    { id: 13, category: 'Wedding', src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200', alt: 'Wedding Saptapadi', caption: 'Wedding — Saptapadi' },

    // Haldi
    { id: 21, category: 'Haldi', src: 'https://images.unsplash.com/photo-1635327883244-a108b9816503?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1635327883244-a108b9816503?auto=format&fit=crop&q=80&w=1200', alt: 'Haldi Ceremony', caption: 'Haldi — Yellow Splash' },
    { id: 22, category: 'Haldi', src: 'https://images.unsplash.com/photo-1594142111586-773df4032483?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1594142111586-773df4032483?auto=format&fit=crop&q=80&w=1200', alt: 'Haldi Rituals', caption: 'Haldi — Tradition' },
    { id: 23, category: 'Haldi', src: 'https://images.unsplash.com/photo-1623696516301-8e9a2b535b6b?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1623696516301-8e9a2b535b6b?auto=format&fit=crop&q=80&w=1200', alt: 'Haldi Bride', caption: 'Haldi — The Bride Smile' },
    { id: 24, category: 'Haldi', src: 'https://images.unsplash.com/photo-1587271407850-8d438914ba1c?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1587271407850-8d438914ba1c?auto=format&fit=crop&q=80&w=1200', alt: 'Haldi Fun', caption: 'Haldi — Fun Moments' },
    { id: 25, category: 'Haldi', src: 'https://images.unsplash.com/photo-1642674976721-a08b9816503?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1642674976721-a08b9816503?auto=format&fit=crop&q=80&w=1200', alt: 'Haldi Family', caption: 'Haldi — Family Love' },

    // Mehandi
    { id: 31, category: 'Mehandi', src: 'https://images.unsplash.com/photo-1579895995254-da7bd008304a?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1579895995254-da7bd008304a?auto=format&fit=crop&q=80&w=1200', alt: 'Mehandi Hands', caption: 'Mehandi — Intricate Art' },
    { id: 32, category: 'Mehandi', src: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1200', alt: 'Bridesmaids Mehandi', caption: 'Mehandi — Group Photo' },
    { id: 33, category: 'Mehandi', src: 'https://images.unsplash.com/photo-1596229340656-788df6c2c31e?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1596229340656-788df6c2c31e?auto=format&fit=crop&q=80&w=1200', alt: 'Mehandi Feet', caption: 'Mehandi — Traditional Patterns' },

    // Others
    { id: 2, category: 'Portrait', src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1200', alt: 'Portrait', caption: 'Portrait — Classic Studio' },
    { id: 5, category: 'Landscape', src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=500', full: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1200', alt: 'Landscape', caption: 'Landscape — Nature Beauty' }
];

const DataManager = {
    getPhotos: () => {
        const stored = localStorage.getItem(DB_KEYS.PHOTOS);
        let photos = stored ? JSON.parse(stored) : [];
        if (!photos || photos.length === 0) {
            // Seed defaults if missing or empty
            photos = DEFAULT_PHOTOS;
            localStorage.setItem(DB_KEYS.PHOTOS, JSON.stringify(photos));
        }
        return photos;
    },

    addPhoto: (photo) => {
        const photos = DataManager.getPhotos();
        const newPhoto = { ...photo, id: Date.now() };
        photos.unshift(newPhoto); // Add to top
        localStorage.setItem(DB_KEYS.PHOTOS, JSON.stringify(photos));
        return newPhoto;
    },

    deletePhoto: (id) => {
        let photos = DataManager.getPhotos();
        photos = photos.filter(p => p.id != id);
        localStorage.setItem(DB_KEYS.PHOTOS, JSON.stringify(photos));
    },

    getOrders: () => {
        const stored = localStorage.getItem(DB_KEYS.ORDERS);
        return stored ? JSON.parse(stored) : [];
    },

    addOrder: (order) => {
        const orders = DataManager.getOrders();
        const newOrder = {
            ...order,
            id: Date.now(),
            status: 'Pending',
            timestamp: new Date().toISOString()
        };
        orders.unshift(newOrder);
        localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
        return newOrder;
    },

    updateOrderStatus: (id, status) => {
        const orders = DataManager.getOrders();
        const index = orders.findIndex(o => o.id == id);
        if (index !== -1) {
            orders[index].status = status;
            localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
        }
    }
};
