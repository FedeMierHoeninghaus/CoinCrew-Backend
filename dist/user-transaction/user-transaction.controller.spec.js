"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_transaction_controller_1 = require("./user-transaction.controller");
const user_transaction_service_1 = require("./user-transaction.service");
describe('UserTransactionController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_transaction_controller_1.UserTransactionController],
            providers: [user_transaction_service_1.UserTransactionService],
        }).compile();
        controller = module.get(user_transaction_controller_1.UserTransactionController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=user-transaction.controller.spec.js.map