import { expect } from 'chai';
import CategoryService from '../category.service.js';
import { dbMemory, createDb } from '../../utils/test-utils.js';

describe('Category service test', () => {
    before(async () => {
        await createDb(dbMemory);
    });

    it('Should add category', async () => {
        const categoryService = new CategoryService({ db: dbMemory });

        const newCategoryId = await categoryService.addCategory('Test category');
        expect(newCategoryId).to.be.a('array').to.have.lengthOf(1);
        expect(newCategoryId[0]).to.be.a('number');
    });

    it('Should get all categories', async () => {
        const categoryService = new CategoryService({ db: dbMemory });
        const allCategories = await categoryService.getCategories();

        expect(allCategories).to.be.a('array').not.to.have.lengthOf(0);
        allCategories.forEach((category) => {
            expect(category).to.be.a('object');
            expect(category).to.have.property('category_id').to.be.a('number');
            expect(category).to.have.property('name').to.be.a('string');
        });
    });

    it('Should check if category exists', async () => {
        const categoryService = new CategoryService({ db: dbMemory });
        const newCategoryId = await categoryService.addCategory('Test category');

        const category = await categoryService.categoryExists(newCategoryId[0]);
        expect(category).to.be.a('array').not.to.have.lengthOf(0);
        expect(category[0]).to.be.a('object');
        expect(category[0]).to.have.property('category_id').to.be.a('number');
        expect(category[0]).to.have.property('name').to.be.a('string');

        const noCategory = await categoryService.categoryExists(999);
        expect(noCategory).to.be.a('array').to.have.lengthOf(0);
    });
});
