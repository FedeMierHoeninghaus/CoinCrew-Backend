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
exports.ChecksController = void 0;
const common_1 = require("@nestjs/common");
const checks_service_1 = require("./checks.service");
const create_check_dto_1 = require("./dto/create-check.dto");
const update_check_dto_1 = require("./dto/update-check.dto");
let ChecksController = class ChecksController {
    constructor(checksService) {
        this.checksService = checksService;
    }
    create(createCheckDto) {
        console.log('createCheckDto', createCheckDto);
        return this.checksService.create(createCheckDto);
    }
    findAll() {
        return this.checksService.findAll();
    }
    findOne(id) {
        return this.checksService.findOne(+id);
    }
    update(id, updateCheckDto) {
        return this.checksService.update(+id, updateCheckDto);
    }
    remove(id) {
        return this.checksService.remove(+id);
    }
};
exports.ChecksController = ChecksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_check_dto_1.CreateCheckDto]),
    __metadata("design:returntype", void 0)
], ChecksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChecksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChecksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_check_dto_1.UpdateCheckDto]),
    __metadata("design:returntype", void 0)
], ChecksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChecksController.prototype, "remove", null);
exports.ChecksController = ChecksController = __decorate([
    (0, common_1.Controller)('checks'),
    __metadata("design:paramtypes", [checks_service_1.ChecksService])
], ChecksController);
//# sourceMappingURL=checks.controller.js.map