"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transactions_controller_1 = require("./transactions.controller");
const transactions_service_1 = require("./transactions.service");
describe('TransactionsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [transactions_controller_1.TransactionsController],
            providers: [transactions_service_1.TransactionsService],
        }).compile();
        controller = module.get(transactions_controller_1.TransactionsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=transactions.controller.spec.js.map