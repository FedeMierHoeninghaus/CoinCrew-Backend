"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundController = void 0;
const common_1 = require("@nestjs/common");
const fund_service_1 = require("./fund.service");
const create_fund_dto_1 = require("./dto/create-fund.dto");
const update_fund_dto_1 = require("./dto/update-fund.dto");
let FundController = class FundController {
    constructor(fundService) {
        this.fundService = fundService;
    }
    create(createFundDto) {
        return this.fundService.create(createFundDto);
    }
    findAll() {
        return this.fundService.findAll();
    }
    findOne(id) {
        return this.fundService.findOne(+id);
    }
    update(id, updateFundDto) {
        return this.fundService.update(+id, updateFundDto);
    }
    remove(id) {
        return this.fundService.remove(+id);
    }
};
exports.FundController = FundController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fund_dto_1.CreateFundDto]),
    __metadata("design:returntype", void 0)
], FundController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FundController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FundController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_fund_dto_1.UpdateFundDto]),
    __metadata("design:returntype", void 0)
], FundController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FundController.prototype, "remove", null);
exports.FundController = FundController = __decorate([
    (0, common_1.Controller)('fund'),
    __metadata("design:paramtypes", [fund_service_1.FundService])
], FundController);
//# sourceMappingURL=fund.controller.js.map