"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const receipts_controller_1 = require("./receipts.controller");
describe('ReceiptsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [receipts_controller_1.ReceiptsController],
        }).compile();
        controller = module.get(receipts_controller_1.ReceiptsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=receipts.controller.spec.js.map