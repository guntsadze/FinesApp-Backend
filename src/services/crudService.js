export class CRUDService {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async getList(filter = {}) {
    return await this.model.find(filter);
  }

  async get(id) {
    return await this.model.findById(id);
  }

  async update(id, newData) {
    return await this.model.findByIdAndUpdate(id, newData, { new: true });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
}
