export class CRUDController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res) => {
    try {
      const item = await this.service.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getList = async (req, res) => {
    try {
      const items = await this.service.getList();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  get = async (req, res) => {
    try {
      const item = await this.service.get(req.params.id);
      if (!item) return res.status(404).json({ message: "Not found" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const updatedItem = await this.service.update(req.params.id, req.body);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      await this.service.delete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
