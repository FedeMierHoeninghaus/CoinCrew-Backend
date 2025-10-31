"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFundDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_fund_dto_1 = require("./create-fund.dto");
class UpdateFundDto extends (0, mapped_types_1.PartialType)(create_fund_dto_1.CreateFundDto) {
}
exports.UpdateFundDto = UpdateFundDto;
//# sourceMappingURL=update-fund.dto.js.map