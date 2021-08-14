const faker = require('faker')

const randomCategoryList = (number) => {
    if (isNaN(number) || number <= 0) return []
    const categoryList = []
    for (let i = 0; i < number; i++) {
        const category = {
            id: faker.datatype.uuid(),
            name: faker.commerce.department(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        categoryList.push(category)
    }
    return categoryList
}

const randomProductList = (categoryList, number) => {
    if (isNaN(number) || number <= 0) return []
    const productList = []
    for (const category of categoryList) {
        for (let i = 0; i < number; i++) {
            const product = {
                id: faker.datatype.uuid(),
                categoryID: category.id,
                name: faker.commerce.productName(),
                color: faker.commerce.color(),
                price: Number.parseFloat(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                thumbnailUrl: faker.image.imageUrl(400, 400),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }
            productList.push(product)
        }
    }
    return productList
}

const randomUserList = () => {
    const user_1 = {
        id: '56793ca5-f981-48cf-b032-9e446f023f0f',
        email: 'admin@gmail.com',
        password: '$2a$10$jvx3k/wyUTmwQj4pKLpss.H7o96Vj4MpUrTabMzGivKu3QueB/vm6',
        username: 'Admin',
        name: 'admin',
        _password: '123456',
    }
    const user_2 = {
        id: '83c550d0-fbaf-4d8d-893a-685aab8572e4',
        email: 'user@gmail.com',
        username: 'User',
        name: 'user',
        password: '$2a$10$bFaffzDC/EwczIPkwB9ouu0Ie1hQg0FdGAArz9D7RCpArX836ZVPi',
        _password: '123456',
    }
    return [user_1, user_2]
}

module.exports = () => {
    const userList = randomUserList()
    const categoryList = randomCategoryList(5)
    const productList = randomProductList(categoryList, 4)
    return {
        users: userList,
        categories: categoryList,
        products: productList,
    }
}
