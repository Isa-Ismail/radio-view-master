import { ParseError, isPossiblePhoneNumber, parsePhoneNumber } from "libphonenumber-js";

export default function validatePhoneNumber({
  value,
}: {
  value: string | undefined;
}): string | undefined {
  if (value) {
    let parseError: ParseError | undefined;

    try {
      const phoneNumber = parsePhoneNumber(value ?? "");
      const ispossible = isPossiblePhoneNumber(value);
      if (!ispossible) {
        parseError = new ParseError();
        parseError.message = "Invalid Phone Number";
      }
    } catch (e) {
      if (e instanceof ParseError) {
        console.log("Parse Error", e);
        parseError = e;
      }
    }
    if (parseError) {
      let message = "";
      if (parseError.message === "TOO_SHORT") {
        message = "Phone number is too short";
      } else if (parseError.message === "TOO_LONG") {
        message = "Phone number is too long";
      } else if (parseError.message === "INVALID_COUNTRY") {
        message = "Invalid Country Code";
      } else if (parseError.message === "NOT_A_NUMBER") {
        message = "Phone number is not a number";
      } else if (parseError.message === "INVALID_LENGTH") {
        message = "Invalid Phone number length";
      } else {
        message = parseError.message;
      }

      return message;
    }
    return undefined;
  }
  return undefined;
}
