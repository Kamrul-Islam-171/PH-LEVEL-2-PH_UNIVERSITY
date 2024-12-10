import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>; // model ta hoy object array dibe or object dibe
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //studentSearchableField = ['email', 'name.firstName'];
  search(studentSearchableField: string[]) {
    const searchTearm = this?.query?.searchTearm;
    if (searchTearm) {
      this.modelQuery = this.modelQuery.find({
        $or: studentSearchableField.map(
          (field) =>
            ({
              [field]: { $regex: searchTearm, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }
    return this; //chaning korar jonno
  }

  filter() {
    const queryObject = { ...this.query };

    //filtering
    const excluedes = ["searchTearm", "sort", "limit", "page", "fields"];
    excluedes.forEach((el) => delete queryObject[el]);

    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);

    return this;
  }

  sort() {
    // let sort = this?.query?.sort || "-createdAt";
   
    let sort = (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const limit = Number(this?.query.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fieldsLimiting() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }
}


export default QueryBuilder;
