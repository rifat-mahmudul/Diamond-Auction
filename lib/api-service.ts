const BASE_URL = "http://localhost:5100/api/v1";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2ZlMTE3N2Q2MzhlNjZjZDc1MWExMWQiLCJpYXQiOjE3NDU1NzE0NjQsImV4cCI6MTc0NjE3NjI2NH0.z-1o55JULy7rIMdgNYq5jHuw61SWutMo-sY715WyG-M";

interface ApiResponse<T> {
  status: boolean | string;
  message: string;
  data?: T;
  results?: number;
  total?: number;
  page?: number;
  totalPages?: number;
  currentPage?: number;
}

class ApiService {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private async request<T>(
    endpoint: string,
    method = "GET",
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      Authorization: `Bearer ${TOKEN}`,
    };

    if (!(data instanceof FormData) && method !== "GET") {
      headers["Content-Type"] = "application/json";
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) { 
      if (data instanceof FormData) {
        config.body = data;
      } else if (method !== "GET") {
        config.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(url, config);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auctions
  async getAllAuctions() {
    return this.request("/auctions/get-all-auctions");
  }

  async getActiveAuctions() {
    return this.request("/admin/auctions/active");
  }

  async getPendingAuctions() {
    return this.request("/admin/auctions/pending");
  }

  async getScheduledAuctions() {
    return this.request("/admin/auctions/scheduled");
  }

  async getEndedAuctions() {
    return this.request("/admin/auctions/ended");
  }

  async acceptAuction(id: string) {
    return this.request(`/admin/auctions/${id}/accept`, "PUT");
  }

  async rejectAuction(id: string) {
    return this.request(`/admin/auctions/${id}/reject`, "PUT");
  }

  async deleteAuction(id: string) {
    return this.request(`/admin/auctions/${id}`, "DELETE");
  }

  // Bidders
  async getAllBidders() {
    return this.request("/bids/all");
  }

  async getTopBidders() {
    return this.request("/bids/top-bidders");
  }

  async deleteBidder(id: string) {
    return this.request(`/bids/delete/${id}`, "DELETE");
  }

  // Categories
  async getAllCategories() {
    return this.request("/admin/categories/all");
  }

  async createCategory(data: FormData) {
    return this.request("/admin/categories/", "POST", data);
  }

  async updateCategory(id: string, data: FormData) {
    return this.request(`/admin/categories/update/${id}`, "PUT", data);
  }

  async deleteCategory(id: string) {
    return this.request(`/admin/categories/delete/${id}`, "DELETE");
  }

  // Blogs
  async getAllBlogs() {
    return this.request("/admin/blogs/all");
  }

  async getBlogDetails(id: string) {
    return this.request(`/admin/blogs/${id}`);
  }

  async createBlog(data: FormData) {
    return this.request("/admin/blogs/create", "POST", data);
  }

  async updateBlog(id: string, data: FormData) {
    return this.request(`/admin/blogs/update/${id}`, "PUT", data);
  }

  async deleteBlog(id: string) {
    return this.request(`/admin/blogs/delete/${id}`, "DELETE");
  }

  async getBlogComments(id: string) {
    return this.request(`/admin/blogs/get-comment/${id}`);
  }

  async deleteBlogComment(blogId: string, commentId: string) {
    return this.request(`/admin/blogs/delete/${blogId}/${commentId}`, "DELETE");
  }

  // Sellers
  async getAllSellers() {
    return this.request("/admin/sellers/all");
  }
}

export const apiService = new ApiService();
