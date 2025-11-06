"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transactions_service_1 = require("./transactions.service");
describe('TransactionsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [transactions_service_1.TransactionsService],
        }).compile();
        service = module.get(transactions_service_1.TransactionsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=transactions.service.spec.js.map