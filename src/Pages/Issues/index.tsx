import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";

import "../../styles.css";

export interface IRepository {
  issueTitle: string;
  userLogin: string;
  avatarUrl: string;
  userUrl: string;
  issueUrl: string;
}

const Issues: React.FC = () => {
  const { userName, repositoryName } = useAppContext();
  const [repositoryList, setRepositoryList] = useState<IRepository[]>([]);

  useEffect(() => {
    axios
      .get(`https://api.github.com/repos/${userName}/${repositoryName}/issues`)
      .then((response) => {
        setRepositoryList(() => {
          let newList = response.data.map((repo: any, index: any) => {
            if (index <= 4) {
              const newIssue: IRepository = {
                userLogin: repo.user.login,
                avatarUrl: repo.user.avatar_url,
                issueTitle: repo.title,
                userUrl: repo.user.html_url,
                issueUrl: repo.html_url,
              };

              return newIssue;
            }
          });
          return newList.filter((item: any) => item !== undefined);
        });
      });
  }, []);

  return (
    <div className="container">
      <div className="content">
        <Link to="/">
          <h4>git hub activity</h4>
        </Link>
        <div className="issues-list">
          <ul>
            {repositoryList.length === 0 && (
              <div className="noUserBox issue">
                <p>Nothing!!</p>
                <p>Your repository dont have issues</p>
              </div>
            )}
            {repositoryList.map((item) => {
              return (
                <li>
                  <img
                    src={item.avatarUrl}
                    alt="userphoto"
                    style={{ width: "6%" }}
                  />
                  <div className="user-name-div" style={{ width: "20%" }}>
                    <label>User name</label>
                    <a href={item.userUrl} target="_blank" rel="noreferrer">
                      <span>{item.userLogin}</span>
                    </a>
                  </div>
                  <div className="issue-title-div">
                    <label>Issue title</label>
                    <a href={item.issueUrl} target="_blank" rel="noreferrer">
                      <span>{item.issueTitle}</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Issues;
