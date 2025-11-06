"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_transaction_service_1 = require("./user-transaction.service");
describe('UserTransactionService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [user_transaction_service_1.UserTransactionService],
        }).compile();
        service = module.get(user_transaction_service_1.UserTransactionService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=user-transaction.service.spec.js.map