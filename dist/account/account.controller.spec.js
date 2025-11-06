"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const account_controller_1 = require("./account.controller");
const account_service_1 = require("./account.service");
describe('AccountController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [account_controller_1.AccountController],
            providers: [account_service_1.AccountService],
        }).compile();
        controller = module.get(account_controller_1.AccountController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=account.controller.spec.js.map