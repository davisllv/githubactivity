import React, { useRef, useState } from "react";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../../styles.css";
import InputText from "../../Components/InputText";
import { Link } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";

export interface IData {
  id: number;
  userName: string;
  repositoryName: string;
  url: string;
  repositoryId: string;
}

const Homepage: React.FC = () => {
  <ToastContainer />;
  const formRef = useRef<FormHandles>(null);

  const { setUserName, setRepositoryName, userDataList, setUserDataList } =
    useAppContext();
  function handleError(error: yup.ValidationError): void {
    error.inner.forEach((item) => {
      toast.error(item.message);
    });
  }

  function handleRemoveValues(id: number): void {
    setUserDataList((prevState) => {
      return prevState.filter((item) => item.id !== id);
    });
    toast.success("User has been removed");
  }

  async function handleSubmitValues(): Promise<void> {
    const schema = yup.object().shape({
      userName: yup.string().required("User name is required"),
      repositoryName: yup.string().required("Repository name is required"),
    });
    const user = formRef.current?.getFieldValue("userName");
    const repository = formRef.current?.getFieldValue("repositoryName");
    /* =========Testar se o Usuário e o repositorio já foram cadastrados=========*/
    const userExists = userDataList.some(
      (item) => item.userName === user && item.repositoryName === repository
    );

    if (userExists) {
      toast.error("User already registered with the same repository");
      return;
    }
    try {
      const data = formRef.current?.getData();
      await schema.validate(data, { abortEarly: false });

      /* =========Testar se o Usuário possui o repositório no git=========*/
      const responseRepository = await axios.get(
        `https://api.github.com/users/${user}/repos`
      );
      const repositoryExists = responseRepository.data.find(
        (item: any) => item.name === repository
      );

      if (!repositoryExists) {
        toast.error("This user does not have this repository.");
        return;
      }
      /* =========Obter os dados do usuário=========*/
      const response = await axios.get(`https://api.github.com/users/${user}`);
      const avatarUrl = response.data.avatar_url;
      setUserDataList((prevState) => {
        const newUser: IData = {
          id: Math.round(Math.random() * 100),
          userName: user,
          repositoryName: repository,
          url: avatarUrl,
          repositoryId: repositoryExists.id,
        };

        const newList = [...prevState, newUser];
        return newList;
      });

      toast.success("User has been registered");
    } catch (error) {
      if (error instanceof yup.ValidationError) handleError(error);
    }
  }

  return (
    <div className="container">
      <div className="content">
        <ToastContainer pauseOnHover={false} />
        <h4>git hub activity</h4>
        <div className="form-box">
          <Form ref={formRef} onSubmit={handleSubmitValues}>
            <div className="inpt-box">
              <InputText name="userName" placeholder="User name" />
              <InputText name="repositoryName" placeholder="Repository name" />
              <button type="submit">Register</button>
            </div>
          </Form>
        </div>
        <div className="list-box">
          <ul>
            {userDataList.length === 0 && (
              <div className="noUserBox">
                <p>Nothing!!</p>
                <p>Your user list is empty</p>
              </div>
            )}
            {userDataList.map((item) => {
              return (
                <li>
                  <img src={item.url} alt="userphoto" />
                  <span>{item.userName}</span>
                  <Link
                    to={`/issues/${item.repositoryId}`}
                    onClick={() => {
                      setUserName(item.userName);
                      setRepositoryName(item.repositoryName);
                    }}
                  >
                    <span>{item.repositoryName}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleRemoveValues(item.id);
                    }}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
