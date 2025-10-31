"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const receipts_service_1 = require("./receipts.service");
describe('ReceiptsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [receipts_service_1.ReceiptsService],
        }).compile();
        service = module.get(receipts_service_1.ReceiptsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=receipts.service.spec.js.map