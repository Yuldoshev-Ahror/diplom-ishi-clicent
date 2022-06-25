export default class DeleverService {
  proxy = "";
  // _apiBase = "https://customer.api.delever.uz/v1";
  _apiBase = "https://deplom-ishi-backend.herokuapp.com";
  // _shipper = "d4b1658f-3271-4973-8591-98a82939a664"; // for test
  _shipper = "36b00947-ad7a-40eb-b7ca-1c0ea267f2ac"; // for live
  // _shipperApiBase = "https://test.shipper-user.api.delever.uz/"; //for test
  _shipperApiBase = "https://shipper-user.api.delever.uz/"; //for live
  _platform = "1822349b-94bd-4437-9b69-998df0916c40";
  async getResource(url) {
    const res = await fetch(`${this.proxy}${this._apiBase}${url}`, {
      method: "GET",
      headers: {
        Shipper: this._shipper,
      },
    });

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }
  async getResourseShipper(url) {
    const res = await fetch(`${this.proxy}${this._shipperApiBase}${url}`, {
      method: "GET",
      headers: {
        Shipper: this._shipper,
      },
    });

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async get(url, authorization) {
    const res = await fetch(`${this.proxy}${this._apiBase}${url}`, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
    });

    return res;
  }
  async delete(url, authorization) {
    const res = await fetch(`${this.proxy}${this._apiBase}${url}`, {
      method: "DELETE",
      headers: {
        Authorization: authorization,
      },
    });

    return res;
  }
  async postData(url, data, shipper, platform) {
    const res = await fetch(`${this.proxy}${this._apiBase}${url}`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        shipper,
        platform,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });

    return res;
  }

  async post(url, refresh_token) {
    const res = await fetch(`${this.proxy}${this._apiBase}${url}`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: refresh_token,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });

    return res;
  }

  async putData(url, data, authorization) {
    const res = await fetch(`${this.proxy}${this._apiBase}${url}`, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });

    return res;
  }
  async postDataWithToken(url, data, authorization, headers) {
    const res = await fetch(`${this.proxy}${this._apiBase}${url}`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        ...headers,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }

    return res.json();
  }

  async generatePaymentLink(data, token) {
    const res = await this.postDataWithToken(
      "/payment/payme-link",
      data,
      token
    );
    return res;
  }

  async getAllMeals(category) {
    const res = await this.getResource(
      `/product?limit=1000&category_id=${category}`
    );
    return res.products;
  }
  async getTimeWorks() {
    const res = await this.getResourseShipper(`v1/shippers/${this._shipper}`);

    return res;
  }
  async getAddress(authorization) {
    const res = await this.get(`/my-addresses`, authorization);
    const data = await res.json();
    return data;
  }

  async removeAddress(authorization, id) {
    const res = await this.delete(`/my-delete-address/${id}`, authorization);
    const data = await res.json();
    return data;
  }

  async getDeleverPrice() {
    const res = await this.getResource("/delivery-price");
    return res;
  }

  async getCategory(page) {
    const res = await this.getResource(`/category?page=${page}&limit=1`);
    return res.categories;
  }

  async getAllCategories() {
    const res = await this.getResource("/categories");
    return res.categories;
  }

  async getProfile(authorization) {
    const res = await this.get("/profile", authorization);
    return res;
  }

  async getBanners() {
    const res = await this.getResource("/banners");
    return res;
  }

  async refresh(refresh_token) {
    const res = await this.post("/customers/refresh-token", refresh_token);
    return res;
  }

  async getOrders(authorization, customer_id, data = null) {
    return await fetch(
      `${this.proxy}${this._apiBase}/orders?page=${data.page}&limit=${data.limit}`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      }
    );
  }

  async getOrderById(authorization, order_id) {
    return await this.get(`/order/${order_id}`, authorization);
  }

  async register(data) {
    const res = await this.postData("/register", data, this._shipper);
    return res;
  }

  async login(data) {
    const res = await this.postData("/login", data, this._shipper);
    return res;
  }

  async profileUpdate(data, id, authorization) {
    const res = await this.putData(`/profile-update`, data, authorization);
    return res;
  }

  async registerConfirm(data) {
    const res = await this.postData(
      "/register-confirm",
      data,
      this._shipper
    );
    return res;
  }

  async loginConfirm(data) {
    const res = await this.postData(
      "/login-confirm",
      data,
      this._shipper,
      this._platform
    );
    return res;
  }

  async addAddress(data, authorization) {
    try {
      const res = await this.postDataWithToken(
        `/my_address`,
        data,
        authorization,
        {
          shipper: this._shipper,
          platform: this._platform,
        }
      );
      return res;
    } catch (error) {
      return null;
    }
  }

  async orderCreate(data, authorization) {
    const res = await this.postDataWithToken(
      "/order",
      data,
      authorization
    );
    return res;
  }
  async getUsers() {
    const res = await this.getResource("/customers");
    return res;
  }
  async getBranch() {
    const res = await this.getResource("/branches?limit=100");
    return res;
  }
}
